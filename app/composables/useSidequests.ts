import type { Database } from '~/types/database.types'

type Sidequest = Database['public']['Tables']['sidequests']['Row']
type UserSidequest = Database['public']['Tables']['user_sidequests']['Row']

export const useSidequests = () => {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  // Get all sidequests with user completion status
  const getAllSidequestsWithStatus = async () => {
    const userId = user.value?.id || user.value?.sub
    if (!userId) {
      // Not logged in - just return sidequests without status
      const { data, error } = await client
        .from('sidequests')
        .select('*')
        .order('sort_order')

      return { data, error }
    }

    // Logged in - join with user_sidequests
    const { data, error } = await client
      .from('sidequests')
      .select(`
        *,
        user_sidequests!left(completed, completed_at)
      `)
      .eq('user_sidequests.user_id', userId)
      .order('sort_order')

    return { data, error }
  }

  // Toggle sidequest completion
  const toggleSidequest = async (sidequestId: string, completed: boolean) => {
    const userId = user.value?.id || user.value?.sub
    if (!userId) return { error: { message: 'Not authenticated' } }

    // Check if record exists
    const { data: existing } = await client
      .from('user_sidequests')
      .select('id')
      .eq('user_id', userId)
      .eq('sidequest_id', sidequestId)
      .maybeSingle()

    if (existing) {
      // Update existing record
      const { error } = await client
        .from('user_sidequests')
        .update({
          completed,
          completed_at: completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('sidequest_id', sidequestId)

      return { error }
    } else {
      // Insert new record
      const { error } = await client.from('user_sidequests').insert({
        user_id: userId,
        sidequest_id: sidequestId,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      })

      return { error }
    }
  }

  return {
    getAllSidequestsWithStatus,
    toggleSidequest,
  }
}
