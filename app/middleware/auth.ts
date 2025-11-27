export default defineNuxtRouteMiddleware(async (to, from) => {
  const client = useSupabaseClient()

  // Prefer checking the Supabase session
  try {
    const { data } = await client.auth.getSession()
    if (data?.session) return
  } catch (e) {
    // ignore and fallback to user ref
  }

  const user = useSupabaseUser()

  // If user is still initializing on the client, give it a short momentd
  if (process.client && user.value === undefined) {
    await new Promise(resolve => setTimeout(resolve, 50))
  }

  if (!user.value) {
    // Avoid redirecting from server-side when state is uncertain
    if (process.server) return
    return navigateTo('/login')
  }
})
