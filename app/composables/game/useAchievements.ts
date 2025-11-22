import type { Database } from '~/types/database.types'

type Achievement = Database['public']['Tables']['achievements']['Row']
type UserAchievement = Database['public']['Tables']['user_achievements']['Row']

export const useAchievements = () => {
  const { getAllWithStatus, toggle } = useTrackable(
    'achievements',
    'user_achievements',
    'achievement_id'
  )

  return {
    getAllAchievementsWithStatus: getAllWithStatus,
    toggleAchievement: toggle,
  }
}
