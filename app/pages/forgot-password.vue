<template>
  <div class="d-flex justify-center">
    <v-card class="pa-12 d-flex flex-column ga-8" width="600" outlined>
      <v-card-title class="text-h4 py-0">Forgot password</v-card-title>

      <v-form class="d-flex flex-column ga-4" @submit.prevent="handleResetPassword">
        <AppAlert
          v-if="feedback.message"
          :message="feedback.message"
          :type="feedback.type"
          @clear="clearFeedback"
        />

        <v-text-field
          v-model="email"
          prepend-inner-icon="mdi-email"
          label="Email address"
          type="email"
        />

        <NuxtTurnstile v-model="token" class="mt-2 mx-auto" />

        <v-btn type="submit" class="mt-4" color="primary" block :loading="loading">
          Request reset link</v-btn
        >
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Forgot Password | Pod Data',
})

const { resetPassword } = useAuth()
const email = ref('')
const token = ref('')
const loading = ref(false)
const feedback = ref({ message: '', type: 'info' as 'success' | 'error' | 'info' | 'warning' })

const handleResetPassword = async () => {
  if (!email.value.trim()) {
    feedback.value = { message: 'Please enter your email.', type: 'error' }
    return
  }

  if (!token.value) {
    feedback.value = { message: 'Please complete the security check', type: 'error' }
    return
  }

  loading.value = true
  const startTime = Date.now()

  const { error } = await resetPassword(
    email.value.trim(),
    token.value,
    `${window.location.origin}/new-password`
  )

  // Ensure minimum loading time to prevent timing attacks
  const elapsedTime = Date.now() - startTime
  const minDelay = 1000 // 1 second
  if (elapsedTime < minDelay) {
    await new Promise(resolve => setTimeout(resolve, minDelay - elapsedTime))
  }

  loading.value = false

  // Always show success message to prevent email enumeration via error messages (like rate limits)
  feedback.value = { message: 'Please check your email for the reset link.', type: 'success' }
}

const clearFeedback = () => {
  feedback.value.message = ''
}
</script>
