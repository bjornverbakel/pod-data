import type { Database } from '~/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

export const useProfile = () => {
  const user = useSupabaseUser()
  const client = useSupabaseClient<Database>()
  const profile = useState<Profile | null>('profile', () => null)

  const fetchProfile = async () => {
    const userId = user.value?.id || user.value?.sub
    if (!userId) {
      profile.value = null
      return
    }

    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      console.error('Error fetching profile:', error)
      return
    }

    profile.value = data
  }

  // Fetch profile when user changes
  watch(
    () => user.value?.id || user.value?.sub,
    (userId) => {
      if (userId) {
        fetchProfile()
      } else {
        profile.value = null
      }
    },
    { immediate: true }
  )

  return {
    profile,
    fetchProfile,
  }
}
