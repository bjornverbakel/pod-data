export const useAuth = () => {
  const user = useSupabaseUser()
  const client = useSupabaseClient()

  const isAnonymous = computed(() => {
    return user.value?.is_anonymous ?? false
  })

  const convertAnonymousToUser = async (credentials: { email: string; password: string; username?: string }) => {
    const { email, password, username } = credentials
    
    if (!isAnonymous.value) {
      return { error: new Error('User is not anonymous') }
    }

    const updateData: { email: string; password: string; data?: { username: string; full_name: string } } = {
      email,
      password,
    }

    if (username) {
      updateData.data = { username, full_name: username }
    }

    const userId = user.value?.id || user.value?.sub

    // Update profile first to avoid race conditions with useProfile watcher
    if (username && userId) {
      const { data: profileData, error: profileError } = await client
        .from('profiles')
        .upsert({
          id: userId,
          username: username,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()
      
      if (profileError) {
        console.error('Profile update error:', profileError)
        return { data: null, error: profileError }
      }

      // Update the profile state
      const profile = useState('profile')
      profile.value = profileData
    }

    const { data, error } = await client.auth.updateUser(updateData)

    return { data, error }
  }

  return {
    isAnonymous,
    convertAnonymousToUser,
  }
}
