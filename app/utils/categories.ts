export interface Category {
  key: string
  name: string
  icon: string
  composable: () => any
  fetchFunction: string
  relationKey: string
}

export const categories: Category[] = [
  {
    key: 'achievements',
    name: 'Achievements',
    icon: 'mdi-trophy',
    composable: useAchievements,
    fetchFunction: 'getAllAchievementsWithStatus',
    relationKey: 'user_achievements',
  },
  {
    key: 'endings',
    name: 'Endings',
    icon: 'mdi-book-open',
    composable: useEndings,
    fetchFunction: 'getAllEndingsWithStatus',
    relationKey: 'user_endings',
  },
  {
    key: 'sidequests',
    name: 'Side Quests',
    icon: 'mdi-map',
    composable: useSidequests,
    fetchFunction: 'getAllSidequestsWithStatus',
    relationKey: 'user_sidequests',
  },
  {
    key: 'pod-programs',
    name: 'Pod Programs',
    icon: 'mdi-chip',
    composable: usePodPrograms,
    fetchFunction: 'getAllPodProgramsWithStatus',
    relationKey: 'user_pod_programs',
  },
  {
    key: 'weapons',
    name: 'Weapons',
    icon: 'mdi-sword',
    composable: useWeapons,
    fetchFunction: 'getAllWeaponsWithStatus',
    relationKey: 'user_weapons',
  },
  {
    key: 'archives',
    name: 'Archives',
    icon: 'mdi-archive',
    composable: useArchives,
    fetchFunction: 'getAllArchivesWithStatus',
    relationKey: 'user_archives',
  },
  {
    key: 'enemies',
    name: 'Enemies',
    icon: 'mdi-robot-angry',
    composable: useEnemies,
    fetchFunction: 'getAllEnemiesWithStatus',
    relationKey: 'user_enemies',
  },
  {
    key: 'fish',
    name: 'Fish',
    icon: 'mdi-fish',
    composable: useFish,
    fetchFunction: 'getAllFishWithStatus',
    relationKey: 'user_fish',
  },
  {
    key: 'novels',
    name: 'Novels',
    icon: 'mdi-book',
    composable: useNovels,
    fetchFunction: 'getAllNovelsWithStatus',
    relationKey: 'user_novels',
  },
]
