import type { Database } from '~/types/database.types'

type Ending = Database['public']['Tables']['endings']['Row']
type UserEnding = Database['public']['Tables']['user_endings']['Row']

export const useEndings = () => {
  const { getAllWithStatus, toggle } = useTrackable(
    'endings',
    'user_endings',
    'ending_id'
  )

  return {
    getAllEndingsWithStatus: getAllWithStatus,
    toggleEnding: toggle,
  }
}
