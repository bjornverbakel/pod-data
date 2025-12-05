import type { Database } from '~/types/database.types'

export const useDataManagement = () => {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  const exportData = async () => {
    if (!user.value) throw new Error('User not authenticated')
    const userId = user.value.id || (user.value as any).sub

    const exportData: Record<string, any[]> = {}

    for (const category of categories) {
      const { data, error } = await client
        .from(category.relationKey as any)
        .select('*')
        .eq('user_id', userId)

      if (error) throw error

      // Clean up data before export
      // We keep the foreign key, completed status, and completed_at
      exportData[category.key] = data.map((item: any) => {
        const { id, user_id, created_at, updated_at, ...rest } = item
        return rest
      })
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pod-data-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const processImportData = async (data: any) => {
    if (!user.value) throw new Error('User not authenticated')
    const userId = user.value.id || (user.value as any).sub

    for (const category of categories) {
      const items = data[category.key]
      if (!items || !Array.isArray(items)) continue

      // Prepare items for upsert
      const upsertItems = items.map((item: any) => ({
        ...item,
        user_id: userId,
        updated_at: new Date().toISOString(),
        // If completed_at is missing in import (e.g. old export), set it if completed is true
        completed_at: item.completed_at || (item.completed ? new Date().toISOString() : null),
      }))

      if (upsertItems.length === 0) continue

      const { error } = await client
        .from(category.relationKey as any)
        .upsert(upsertItems, { onConflict: `user_id,${category.foreignKey}` })

      if (error) throw error
    }
  }

  const importData = async (file: File) => {
    const text = await file.text()
    const data = JSON.parse(text)
    await processImportData(data)
  }

  const clearAllData = async () => {
    if (!user.value) throw new Error('User not authenticated')
    const userId = user.value.id || (user.value as any).sub

    await Promise.all(
      categories.map(category =>
        client
          .from(category.relationKey as any)
          .delete()
          .eq('user_id', userId)
          .then(({ error }) => {
            if (error) throw error
          })
      )
    )
  }

  return {
    exportData,
    importData,
    processImportData,
    clearAllData,
  }
}
