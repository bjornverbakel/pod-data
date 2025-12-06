/**
 * This utility parses the binary save file (SlotData_X.dat) to extract collected items.
 *
 * Key Offsets (Decimal):
 * - Inventory: 198000 (0x30570)
 * - Weapons:   204144 (0x31D70)
 * - Pods:      205744 (0x323B0)
 */

import { WEAPON_IDS, POD_PROGRAM_IDS, FISH_IDS, ARCHIVE_IDS } from './nier-item-ids'

export interface NierSaveData {
  items: number[]
  weapons: number[]
  podPrograms: number[]
  fish: number[]
  archives: number[]
  rawWeapons?: { id: number; level: number; exp: number }[]
  rawInventory?: { id: number; status: number; count: number }[]
}

export const parseNierSave = (buffer: ArrayBuffer): NierSaveData => {
  const view = new DataView(buffer)
  const items: number[] = []
  const weapons: number[] = []
  const podPrograms: number[] = []
  const fish: number[] = []
  const archives: number[] = []

  // Debug arrays
  const rawWeapons: { id: number; level: number; exp: number }[] = []
  const rawInventory: { id: number; status: number; count: number }[] = []

  // --- INVENTORY & FISH ---
  // Offset: 198000 (0x30570)
  // Size: 12 bytes per entry
  // Structure:
  // [ID: 4 bytes] [Status: 4 bytes] [Count: 4 bytes]
  //
  // Example (Mackeral):
  // E9 1F 00 00 (ID: 8169)
  // 01 00 00 00 (Status: 1 = Owned/Seen)
  // 01 00 00 00 (Count: 1)
  const inventoryOffset = 198000
  const inventoryCount = 255 // Approx max items

  for (let i = 0; i < inventoryCount; i++) {
    const offset = inventoryOffset + i * 12
    if (offset + 12 > buffer.byteLength) break

    const id = view.getInt32(offset, true)
    const status = view.getInt32(offset + 4, true)
    const count = view.getInt32(offset + 8, true)

    if (id !== -1 && id !== 0) {
      rawInventory.push({ id, status, count })

      // Fish IDs are typically in the 8000+ range
      if (FISH_IDS[id]) {
        if (count > 0) fish.push(id)
      } else if (ARCHIVE_IDS[id]) {
        if (count > 0) archives.push(id)
      } else if (count > 0) {
        items.push(id)
      }
    }
  }

  // --- WEAPONS ---
  // Offset: 204144 (0x31D70)
  // Size: ~960 bytes (80 * 12)
  // Structure: [ID: 4 bytes] [Level: 4 bytes] ...
  // Note: The data appears to be packed or have variable strides in some save files.
  // The buffer is scanned in 4-byte steps to find valid [ID, Level] pairs.
  const weaponsOffset = 204144
  const weaponsBufferSize = 80 * 12 // Scan range

  for (let offset = weaponsOffset; offset < weaponsOffset + weaponsBufferSize; offset += 4) {
    if (offset + 8 > buffer.byteLength) break

    const id = view.getInt32(offset, true)
    const level = view.getInt32(offset + 4, true)

    // Check if this looks like a valid weapon entry
    if (id !== -1 && id !== 0 && WEAPON_IDS[id]) {
      // It's a known weapon ID.
      // Captured for debug purposes (using 'exp' as 0 since its location is uncertain)
      rawWeapons.push({ id, level, exp: 0 })

      // Check if it is max level
      if (level === 4) {
        weapons.push(id)
      }
    }
  }

  // --- POD PROGRAMS ---
  // Offset: 205744 (0x323B0)
  // Size: ~360 bytes (30 * 12)
  // Structure: [Status: 4 bytes] [ID: 4 bytes] ... or similar
  // The buffer is scanned for valid Pod IDs.
  const podProgramsOffset = 205744
  const podProgramsBufferSize = 50 * 12 // Scan range (generous)

  for (
    let offset = podProgramsOffset;
    offset < podProgramsOffset + podProgramsBufferSize;
    offset += 4
  ) {
    if (offset + 4 > buffer.byteLength) break

    const val = view.getInt32(offset, true)

    if (val !== -1 && val !== 0 && POD_PROGRAM_IDS[val]) {
      // Found a valid Pod ID.
      // Just having the ID in the slot usually means it has been obtained. The check is permissive.
      podPrograms.push(val)
    }
  }

  // --- ARCHIVES SCAN ---
  // Archives are not in the standard inventory block.
  // The entire buffer is scanned for known Archive IDs.
  const archiveIdsSet = new Set(Object.keys(ARCHIVE_IDS).map(Number))

  // Scan the entire buffer with a stride of 4 bytes
  for (let offset = 0; offset < buffer.byteLength - 4; offset += 4) {
    const val = view.getInt32(offset, true)
    if (archiveIdsSet.has(val)) {
      if (!archives.includes(val)) {
        archives.push(val)
      }
    }
  }

  return {
    items,
    weapons,
    podPrograms,
    fish,
    archives,
    rawWeapons,
    rawInventory,
  }
}
