import { parseNierSave, type NierSaveData } from '~/utils/nier-save-parser'
import {
  WEAPON_IDS,
  POD_PROGRAM_IDS,
  FISH_IDS,
  ARCHIVE_IDS,
  normalizeName,
} from '~/utils/nier-item-ids'
import { categories } from '~/utils/categories'

export const useSaveImporter = () => {
  const importing = ref(false)
  const error = ref('')
  const successMessage = ref('')
  const client = useSupabaseClient()
  const user = useSupabaseUser()

  /**
   * Core logic to map parsed save data to database structure.
   */
  const mapSaveDataToCategories = async (saveData: NierSaveData) => {
    // 1. Normalize names from the save file for fuzzy matching
    const foundWeapons = new Set(
      saveData.weapons
        .map(id => WEAPON_IDS[id])
        .filter((name): name is string => !!name)
        .map(normalizeName)
    )
    const foundPodPrograms = new Set(
      saveData.podPrograms
        .map(id => POD_PROGRAM_IDS[id])
        .filter((name): name is string => !!name)
        .map(normalizeName)
    )
    const foundFish = new Set(
      saveData.fish
        .map(id => FISH_IDS[id])
        .filter((name): name is string => !!name)
        .map(normalizeName)
    )
    const foundArchives = new Set(
      saveData.archives
        .map(id => ARCHIVE_IDS[id])
        .filter((name): name is string => !!name)
        .map(normalizeName)
    )

    const exportData: Record<string, any[]> = {}
    let totalFound = 0

    // Initialize all categories
    for (const category of categories) {
      exportData[category.key] = []
    }

    // 2. Iterate over categories and match items against the database
    for (const category of categories) {
      let tableName = category.key

      if (category.key === 'pod-programs') tableName = 'pod_programs' // Adjust table name to match DB

      // Determine which set of found names to use for this category
      let foundNames: Set<string> | null = null
      if (category.key === 'weapons') foundNames = foundWeapons
      else if (category.key === 'pod-programs') foundNames = foundPodPrograms
      else if (category.key === 'fish') foundNames = foundFish
      else if (category.key === 'archives') foundNames = foundArchives

      if (!foundNames) continue

      // Fetch all items for this category from DB to get their UUIDs
      const { data: dbItems, error: dbError } = await client
        .from(tableName as any)
        .select('id, name')

      if (dbError || !dbItems) {
        console.error(`Failed to fetch items for ${tableName}`, dbError)
        continue
      }

      for (const item of dbItems as any[]) {
        const normalizedDbName = normalizeName(item.name)
        if (foundNames.has(normalizedDbName)) {
          // Add to export data
          const categoryList = exportData[category.key]
          if (categoryList) {
            categoryList.push({
              [category.foreignKey]: item.id,
              completed: true,
              completed_at: new Date().toISOString(),
            })
            totalFound++
          }
        }
      }
    }

    return {
      exportData,
      totalFound,
    }
  }

  const importSaveFile = async (file: File) => {
    let currentUser: any = user.value

    // Double check auth state if user ref is empty
    if (!currentUser) {
      const { data } = await client.auth.getUser()
      currentUser = data.user
    }

    if (!currentUser) {
      console.error('Import failed: No authenticated user found.')
      error.value = 'You must be logged in to import data.'
      return
    }

    const userId = currentUser.id
    console.log('Importing for User ID:', userId)

    importing.value = true
    error.value = ''
    successMessage.value = ''

    try {
      const buffer = await file.arrayBuffer()
      const saveData = parseNierSave(buffer)

      console.log('Parsed Save Data:', saveData)

      // Use shared mapping logic
      const { exportData, totalFound } = await mapSaveDataToCategories(saveData)

      // Check if we found anything at all
      if (totalFound === 0) {
        // Fallback check for generic items if we implement that later
        if (saveData.items.length === 0) {
          successMessage.value = `Parsed save file, but found no matching items in our database mapping yet.`
          importing.value = false
          return
        }
      }

      // 3. Use useDataManagement to process the data
      const { processImportData } = useDataManagement()
      await processImportData(exportData)

      successMessage.value = `Successfully imported save data! Updated ${totalFound} items.`
    } catch (e: any) {
      console.error(e)
      error.value = `Failed to import save file: ${e.message}`
    } finally {
      importing.value = false
    }
  }

  const downloadParsedSave = async (file: File) => {
    try {
      const buffer = await file.arrayBuffer()
      const saveData = parseNierSave(buffer)

      // Use shared mapping logic
      const { exportData } = await mapSaveDataToCategories(saveData)

      // Add debug info
      exportData._debug_weapons = saveData.weapons.map(
        id => `0x${id.toString(16).toUpperCase()} (${WEAPON_IDS[id] || '?'})`
      )
      exportData._debug_pods = saveData.podPrograms.map(
        id => `0x${id.toString(16).toUpperCase()} (${POD_PROGRAM_IDS[id] || '?'})`
      )
      exportData._debug_fish = saveData.fish.map(
        id => `0x${id.toString(16).toUpperCase()} (${FISH_IDS[id] || '?'})`
      )
      exportData._debug_archives = saveData.archives.map(
        id => `0x${id.toString(16).toUpperCase()} (${ARCHIVE_IDS[id] || '?'})`
      )

      // Raw debug info
      if (saveData.rawWeapons) {
        exportData._debug_raw_weapons = saveData.rawWeapons.map(w => ({
          ...w,
          hexId: `0x${w.id.toString(16).toUpperCase()}`,
          name: WEAPON_IDS[w.id] || 'Unknown',
        }))
      }
      if (saveData.rawInventory) {
        exportData._debug_raw_inventory = saveData.rawInventory.map(i => ({
          ...i,
          hexId: `0x${i.id.toString(16).toUpperCase()}`,
          name: FISH_IDS[i.id] || 'Unknown',
        }))
      }

      // Create downloadable JSON
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `nier-export-save.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      return saveData
    } catch (e: any) {
      error.value = `Parse error: ${e.message}`
    }
  }

  return {
    importSaveFile,
    downloadParsedSave,
    importing,
    error,
    successMessage,
  }
}
