export interface Category {
  key: string
  name: string
  icon: string
  composable: () => any
  fetchFunction: string
  relationKey: string
  foreignKey: string
}

export const categories: Category[] = [
  {
    key: 'achievements',
    name: 'Achievements',
    icon: 'mdi-trophy',
    composable: useAchievements,
    fetchFunction: 'getAllAchievementsWithStatus',
    relationKey: 'user_achievements',
    foreignKey: 'achievement_id',
  },
  {
    key: 'endings',
    name: 'Endings',
    icon: 'mdi-book-open',
    composable: useEndings,
    fetchFunction: 'getAllEndingsWithStatus',
    relationKey: 'user_endings',
    foreignKey: 'ending_id',
  },
  {
    key: 'sidequests',
    name: 'Side Quests',
    icon: 'mdi-map',
    composable: useSidequests,
    fetchFunction: 'getAllSidequestsWithStatus',
    relationKey: 'user_sidequests',
    foreignKey: 'sidequest_id',
  },
  {
    key: 'pod-programs',
    name: 'Pod Programs',
    icon: 'mdi-chip',
    composable: usePodPrograms,
    fetchFunction: 'getAllPodProgramsWithStatus',
    relationKey: 'user_pod_programs',
    foreignKey: 'pod_program_id',
  },
  {
    key: 'weapons',
    name: 'Weapons',
    icon: 'mdi-sword',
    composable: useWeapons,
    fetchFunction: 'getAllWeaponsWithStatus',
    relationKey: 'user_weapons',
    foreignKey: 'weapon_id',
  },
  {
    key: 'archives',
    name: 'Archives',
    icon: 'mdi-archive',
    composable: useArchives,
    fetchFunction: 'getAllArchivesWithStatus',
    relationKey: 'user_archives',
    foreignKey: 'archive_id',
  },
  {
    key: 'enemies',
    name: 'Enemies',
    icon: 'mdi-robot-angry',
    composable: useEnemies,
    fetchFunction: 'getAllEnemiesWithStatus',
    relationKey: 'user_enemies',
    foreignKey: 'enemy_id',
  },
  {
    key: 'fish',
    name: 'Fish',
    icon: 'mdi-fish',
    composable: useFish,
    fetchFunction: 'getAllFishWithStatus',
    relationKey: 'user_fish',
    foreignKey: 'fish_id',
  },
  {
    key: 'novels',
    name: 'Novels',
    icon: 'mdi-book',
    composable: useNovels,
    fetchFunction: 'getAllNovelsWithStatus',
    relationKey: 'user_novels',
    foreignKey: 'novel_id',
  },
]
