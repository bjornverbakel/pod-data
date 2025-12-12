export const WEAPON_IDS: Record<number, string> = {
  // Small Swords
  1003: 'Faith',
  1013: 'Iron Pipe',
  1020: 'Beastbane',
  1030: 'Ancient Overlord',
  1040: 'Phoenix Dagger',
  1050: 'Type-4O Sword',
  1060: 'Type-3 Sword',
  1070: 'Virtuous Contract',
  1071: 'Cruel Oath',
  1080: 'YoRHa-issue Blade',
  1090: 'Machine Sword',
  1100: 'Cypress Stick',
  1101: 'Engine Blade',

  // Large Swords
  1203: 'Iron Will',
  1213: 'Fang of the Twins',
  1220: 'Beastlord',
  1230: 'Phoenix Sword',
  1240: 'Type-4O Blade',
  1250: 'Type-3 Blade',
  1260: 'Virtuous Treaty',
  1261: 'Cruel Blood Oath',
  1270: 'Machine Axe',

  // Spears
  1400: 'Phoenix Lance',
  1420: 'Beastcurse',
  1430: 'Dragoon Lance',
  1440: 'Spear of the Usurper',
  1450: 'Type-4O Lance',
  1460: 'Type-3 Lance',
  1470: 'Virtuous Dignity',
  1471: 'Cruel Arrogance',
  1480: 'Machine Spear',

  // Combat Bracers
  1600: 'Type-3 Fists',
  1610: 'Type-4O Fists',
  1620: 'Virtuous Grief',
  1621: 'Cruel Lament',
  1630: "Demon's Cry",
  1640: "Angel's Folly",
  1650: 'Machine Heads',
  1875: 'Engine Blade',
  1876: 'Cypress Stick',
  1877: 'Emil Heads',
}

export const POD_PROGRAM_IDS: Record<number, string> = {
  2001: 'R010: Laser',
  2002: 'R020: Mirage',
  2003: 'R030: Hammer',
  2004: 'R040: Blade',
  2005: 'R050: Spear',
  2006: 'R070: M Shield',
  2007: 'A060: P Shield',
  2008: 'A080: Wave',
  2009: 'A090: Wire',
  2010: 'A100: Decoy',
  2011: 'A110: Slow',
  2012: 'A120: Repair',
  2015: 'A130: Bomb',
  2019: 'A140: Gravity',
  2021: 'A150: Volt',
  2022: 'A160: Missile',
  2024: 'A170: Scanner',
}

export const FISH_IDS: Record<number, string> = {
  8001: 'Arowana',
  8002: 'Twinfish',
  8003: 'Killifish',
  8004: 'Carp',
  8005: 'Bloat Fish',
  8006: 'Koi Carp',
  8007: 'Fur Carp',
  8008: 'Freshwater Ray',
  8009: 'Arapaima',
  8010: 'Oil Sardine',
  8011: 'Water Flea',
  8012: 'Twoface',
  8013: 'Coelacanth',
  8014: 'Blowfish',
  8015: 'Swordfish',
  8016: 'Mackerel',
  8017: 'Horseshoe Crab',
  8018: 'Beetle Fish',
  8019: 'Starfish',
  8020: 'Bream',
  8021: 'Basking Shark',
  8022: 'Killifish Machine',
  8023: 'Koi Carp Machine',
  8024: 'Arapaima Machine',
  8025: 'Carp Machine',
  8026: 'Bloat Fish Machine',
  8027: 'Blowfish Machine',
  8028: 'Swordfish Machine',
  8029: 'Starfish Machine',
  8030: 'Bream Machine',
  8031: 'Coelacanth Machine',
  8032: 'Mackerel Machine',
  8033: 'Horseshoe Crab Machine',
  8034: 'Arowana Machine',
  8035: 'Basking Shark Machine',
  8036: 'Freshwater Ray Machine',
  8037: 'Machine Lifeform Head',
  8038: 'Tire',
  8039: 'Gas Cylinder',
  8040: 'Battery',
  8041: 'Broken Firearm',
}

export const ARCHIVE_IDS: Record<number, string> = {
  // --- Type: Pearl Harbor Descent Records ---
  1020010: 'YoRHa: Gunner 16', // PearlHarbor1
  1020020: 'YoRHa: Scanner 21', // PearlHarbor2
  1020030: 'YoRHa: Attacker 4', // PearlHarbor3
  1020040: 'YoRHa: Attacker 2', // PearlHarbor4
  1020050: 'Resistance: Rose', // PearlHarbor5
  1020060: 'Resistance: Anemone', // PearlHarbor6
  1020070: 'Pearl Harbor Descent Summary', // PearlHarbor7

  // --- Type: Other (Empty Type in DB) ---
  1040010: 'Letter to the Forest King', // H-Letter
  1050010: "11B's Escape Plan", // H-llBDesertion
  1080010: "Jackass's Bomb Recipe", // H-BombRecipe
  1100010: 'Weapon Shop Flyer', // H-flyer-kj
  1150010: "A Pious Robot's Will", // H-Testament
  1160010: 'Records of Bestial Machine', // H-AnimalRoboMemory
  1090080: '[Top Secret] Project YoRHa', // Robo8 (Note: Fits 'Saved Machine Records' ID sequence, but has empty Type)

  // --- Type: Saved Machine Records ---
  1090010: 'Library Index', // Robo1
  1090020: 'Human Server Records', // Robo2
  1090030: 'Tower System Outline', // Robo3
  1090040: 'Class 1 Patient Health Record', // Robo4
  1161050: '[Top Secret] Black Box', // H-Robo5 (Note: ID implies different sequence, but sort order places it here)
  1090060: '[Top Secret] Model No.2', // Robo6
  1090070: '[Top Secret] YoRHa Disposal', // Robo7

  // --- Type: Engel's Memories ---
  1120010: 'Engels 110-B Record 0005', // Eng1
  1120020: 'Engels 110-B Record 0010', // Eng2
  1120030: 'Engels 110-B Record 0020', // Eng3
  1130010: "Infant Machine's Memories", // H-ChildMemory

  // --- Type: Data Saved on Server ---
  1140010: 'Shipping Records', // Server1
  1140020: 'YoRHa Body Storage Records', // Server2
  1140030: 'Council. YoRHa Records', // Server3

  // --- Type: Old World Information ---
  1170010: 'Abandoned Factory Memo', // LostInfo-Factory1
  1170020: 'Factory Cafeteria Sign', // LostInfo-Factory2
  1170030: 'Newspaper Scrap', // LostInfo-Surmerge1
  1170040: 'Filthy Lottery Ticket', // LostInfo-Park1
  1170050: 'Tattered Pamphlet', // LostInfo-Park2
  1170060: 'Rotten Info Sheet', // LostInfo-Castle1
  1170070: 'Strange Doll', // LostInfo-Woods1
  1170080: 'Bulletin Record', // LostInfo-Desert1
  1170090: 'Paper Attached to Vehicle', // LostInfo-Ruins1
  1170100: 'Ragged DVD', // LostInfo-Ruins2
  1170105: 'Department Store Flyer', // LostInfo-Ruins3
  1170110: 'Nuclear Arms Manual', // LostInfo-Ruins4
  1170112: 'Mysterious Lithograph 1', // MysteryStone1
  1170114: 'Mysterious Lithograph 2', // MysteryStone2
  1170116: 'Mysterious Lithograph 3', // MysteryStone3
  1170118: 'Mysterious Lithograph 4', // MysteryStone4
  1170120: 'Project Gestalt Report 1', // Report1
  1170130: 'Project Gestalt Report 2', // Report2
  1170140: 'Project Gestalt Report 3', // Report3
  1170150: 'Project Gestalt Report 4', // Report4
  1170160: 'Project Gestalt Report 5', // Report5
  1170170: 'Project Gestalt Report 6', // Report6
  1170180: 'Project Gestalt Report 7', // Report7
  1170190: 'Project Gestalt Report 8', // Report8
  1170200: 'Project Gestalt Report 9', // Report9
  1170210: 'Project Gestalt Report 10', // Report10
  1170220: 'Project Gestalt Report 11', // Report11
  1180010: 'Machine Research Report', // H-RoboReport
}

// Not very accurate as of now, unused
export const ACHIEVEMENT_IDS: Record<number, string> = {
  5020: 'Resuscitated Body',
  5021: 'Vestiges of Prosperity',
  5022: "It's a Healthy Baby Boy!",
  5023: 'We Await Your Next Visit',
  5024: 'Creation and Insurrection',
  5025: 'The Mechanical Kingdom',
  5026: 'Ruler of the Deep',
  5027: 'Those Who Love Humans',
  5028: 'Iron Soul',
  5029: 'One Battle Ends',
  5030: 'A New Battle Begins',
  5031: 'Final Wish',
  5032: 'Treacherous Blade',
  5033: 'Farewell, Pascal',
  5034: 'Justice',
  5035: 'Crime and Punishment',
  5036: 'Leaving for the New World',
  5037: 'Beautiful World',
  5038: 'The Minds That Emerged',
  5039: 'The Circle of Death',
  5040: 'Cherish Our Resources',
  5041: 'First Errand',
  5042: 'The Mercenary',
  5043: 'Information Master',
  5044: 'Destruction is My Job',
  5045: 'Chip Collector',
  5046: 'Weapons Maniac',
  5047: 'Tools of the Trade',
  5048: 'Inorganic Blade',
  5049: 'Supreme Support Weapons',
  5050: "Fighting's Not My Thing",
  5051: "A Scanner's Power",
  5052: 'Machines vs. Machines',
  5053: 'The Power of Hate',
  5054: 'Ruler of the Skies',
  5055: 'Harvest King',
  5056: 'Pod Hunter',
  5057: 'Desire Without Emotion',
  5058: 'Animal Rider',
  5059: 'A Round by the Pond',
  5060: "Wait! Don't Kill Me!",
  5061: 'What Are You Doing?',
  5062: 'Not That I Mind...',
  5063: 'Come Take a Look!',
  5064: 'Naughty Children',
  5065: 'Transcendent Being',
  5066: 'Lunar Tear',
}

export const NIER_ITEM_IDS: Record<number, string> = {
  ...WEAPON_IDS,
  ...POD_PROGRAM_IDS,
  ...FISH_IDS,
  ...ARCHIVE_IDS,
}

// Helper to normalize names for matching with DB
export const normalizeName = (name: string) => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '')
}
