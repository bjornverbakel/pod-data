import type { Database } from '~/types/database.types'

type Sidequest = Database['public']['Tables']['sidequests']['Row']
type UserSidequest = Database['public']['Tables']['user_sidequests']['Row']

export const useSidequests = () => {
  const { getAllWithStatus, toggle } = useTrackable(
    'sidequests',
    'user_sidequests',
    'sidequest_id'
  )

  return {
    getAllSidequestsWithStatus: getAllWithStatus,
    toggleSidequest: toggle,
  }
}
