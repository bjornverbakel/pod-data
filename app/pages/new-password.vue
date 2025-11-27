<template>
  <div class="d-flex justify-center auth-main-content h-screen-content align-center">
    <v-card class="d-flex flex-column justify-center" width="600">
      <div class="section-spacing pa-4 pa-sm-16"></div>
      <v-card-title class="text-h4 py-0 text-truncate-wrap">New password</v-card-title>

      <v-form class="d-flex flex-column ga-4" @submit.prevent="updatepassword">
        <AppAlert
          v-if="feedback.message"
          v-model:message="feedback.message"
          :type="feedback.type"
        />

        <v-text-field
          v-model="password"
          prepend-inner-icon="mdi-lock"
          label="Password"
          type="password"
        />

        <v-text-field
          v-model="passwordConfirm"
          prepend-inner-icon="mdi-lock"
          label="Repeat password"
          type="password"
        />

        <v-btn type="submit" color="primary" block :loading="loading"> Reset Password </v-btn>
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'New Password | Pod Data',
})

definePageMeta({ authLayout: true })

const password = ref('')
const passwordConfirm = ref('')
const client = useSupabaseClient()
const user = useSupabaseUser()
const route = useRoute()
const loading = ref(false)
const feedback = ref({ message: '', type: 'info' as 'success' | 'error' | 'info' | 'warning' })

// Watch for user state changes to handle the race condition where
// the session is established slightly after the page mounts.
watch(
  user,
  newUser => {
    if (newUser) {
      // If user becomes authenticated, clear any "session missing" errors
      if (
        feedback.value.type === 'error' &&
        (feedback.value.message.includes('Invalid or expired') ||
          feedback.value.message.includes('Session expired'))
      ) {
        feedback.value = { message: '', type: 'info' }
      }
    }
  },
  { immediate: true }
)

onMounted(() => {
  // Check for error in URL (Supabase redirects here with error params if link is invalid)
  const errorDescription = route.query.error_description as string

  if (errorDescription) {
    feedback.value = {
      message: errorDescription,
      type: 'error',
    }
    return
  }

  // Redirect users who navigate here directly (no session, no recovery token)
  if (!user.value && !route.hash) {
    setTimeout(() => {
      if (!user.value) {
        navigateTo('/login')
      }
    }, 500)
  }
})

const updatepassword = async () => {
  if (!user.value) {
    feedback.value = {
      message: 'Session expired or invalid link. Please request a new one.',
      type: 'error',
    }
    return
  }

  if (password.value !== passwordConfirm.value) {
    feedback.value = { message: 'Password mismatch!', type: 'error' }
    return
  }

  loading.value = true
  const { error } = await client.auth.updateUser({
    password: password.value,
  })

  if (error) {
    loading.value = false
    feedback.value = { message: error.message, type: 'error' }
  } else {
    await client.auth.signOut()
    loading.value = false
    feedback.value = { message: 'Password changed successfully', type: 'success' }
    setTimeout(() => {
      feedback.value.message = ''
      navigateTo('/login')
    }, 2000)
  }
}
</script>
