<template>
  <div class="d-flex justify-center auth-main-content h-screen-content align-center">
    <v-card class="d-flex flex-column justify-center" width="600">
      <div class="section-spacing pa-4 pa-sm-16">
        <v-card-title class="text-h4 pa-0 text-truncate-wrap">
          {{ emailSent ? 'Check your email' : 'Forgot password' }}
        </v-card-title>

        <div v-if="emailSent">
          <EmailSentState
            :email="email"
            action-label="Try again"
            :feedback="feedback"
            @update:feedback="feedback = $event"
            @action="emailSent = false"
          >
            <template #message>
              A password reset link has been sent to <strong>{{ email }}</strong
              >. Please check your inbox to reset your password. This link will expire in 1 hour.
            </template>
          </EmailSentState>
        </div>

        <v-form v-else class="d-flex flex-column ga-4" @submit.prevent="handleResetPassword">
          <AppAlert
            v-if="feedback.message"
            v-model:message="feedback.message"
            :type="feedback.type"
          />

          <v-text-field
            v-model="email"
            prepend-inner-icon="mdi-email"
            label="Email address"
            type="email"
          />

          <NuxtTurnstile v-model="token" class="mt-2 mx-auto" />

          <v-btn type="submit" color="primary" block :loading="loading">
            <span class="text-truncate-wrap">Request reset link</span>
          </v-btn>
        </v-form>

        <div class="text-center text-body-2 text-medium-emphasis">
          <p>
            Remembered your password?
            <NuxtLink :to="'/login'" class="text-decoration-none text-primary"
              >Return to login</NuxtLink
            >
          </p>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Forgot Password',
})

definePageMeta({ authLayout: true })

const { resetPassword } = useAuth()
const { validateEmail, validateCaptcha, resolveAuthError } = useAuthValidation()
const email = ref('')
const token = ref('')
const loading = ref(false)
const emailSent = ref(false)
const feedback = ref({ message: '', type: 'info' as 'success' | 'error' | 'info' | 'warning' })

const handleResetPassword = async () => {
  const emailError = validateEmail(email.value.trim())
  if (emailError) {
    feedback.value = { message: emailError, type: 'error' }
    return
  }

  const captchaError = validateCaptcha(token.value)
  if (captchaError) {
    feedback.value = { message: captchaError, type: 'error' }
    return
  }

  loading.value = true
  const startTime = Date.now()

  const { error } = await resetPassword(
    email.value.trim(),
    token.value,
    `${window.location.origin}/confirm?redirect=${encodeURIComponent('/new-password?type=recovery')}`
  )

  // Ensure minimum loading time to prevent timing attacks
  const elapsedTime = Date.now() - startTime
  const minDelay = Math.random() * (2000 - 1000) + 1000 // Random delay between 1 and 2 seconds
  if (elapsedTime < minDelay) {
    await new Promise(resolve => setTimeout(resolve, minDelay - elapsedTime))
  }

  loading.value = false

  if (error) {
    feedback.value = { message: resolveAuthError(error)!, type: 'error' }
    return
  }

  // Always show success message to prevent email enumeration via error messages (like rate limits)
  emailSent.value = true
  feedback.value = { message: '', type: 'info' }
}
</script>
