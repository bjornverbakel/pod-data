<template>
  <div class="d-flex justify-center auth-main-content h-screen-content align-center">
    <v-card class="d-flex flex-column justify-center" width="600">
      <div class="section-spacing pa-4 pa-sm-16">
        <v-card-title class="text-h4 pa-0 text-truncate-wrap">
          {{ isAnonymous ? 'Create Your Account' : 'Sign up' }}
        </v-card-title>

        <v-form class="d-flex flex-column ga-4" @submit.prevent="handleSignUp">
          <AppAlert
            v-if="isAnonymous"
            type="info"
            message="You're currently in Guest Mode. Sign up to secure your progress!"
            :closable="false"
          />

          <AppAlert
            v-if="feedback.message"
            v-model:message="feedback.message"
            :type="feedback.type"
          />

          <v-text-field
            v-model="username"
            prepend-inner-icon="mdi-account"
            label="Username"
            type="text"
          />

          <v-text-field
            v-model="email"
            prepend-inner-icon="mdi-email"
            label="Email address"
            type="email"
          />

          <v-text-field
            v-model="password"
            prepend-inner-icon="mdi-lock"
            label="Password"
            type="password"
          />

          <NuxtTurnstile v-model="token" class="mt-2 mx-auto" />

          <v-btn type="submit" color="primary" block :loading="loading"> Sign up </v-btn>
        </v-form>

        <div v-if="!isAnonymous" class="d-flex align-center">
          <v-divider />
          <span class="mx-4">Or</span>
          <v-divider />
        </div>

        <v-btn
          v-if="!isAnonymous"
          @click="handleAnonymousSignIn"
          variant="tonal"
          block
          :loading="anonymousLoading"
        >
          <span class="text-truncate-wrap">Continue as Guest</span>
        </v-btn>

        <div class="text-center text-body-2 text-medium-emphasis">
          <p>
            Already have an account?
            <NuxtLink
              :to="{ path: '/login', query: route.query }"
              class="text-decoration-none text-primary"
              >Log in</NuxtLink
            >
          </p>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Register | Pod Data',
})

definePageMeta({ authLayout: true })

const { isAnonymous, register, signInAnonymously } = useAuth()
const username = ref('')
const email = ref('')
const password = ref('')
const token = ref('')
const user = useSupabaseUser()
const route = useRoute()
const loading = ref(false)
const anonymousLoading = ref(false)
const feedback = ref({ message: '', type: 'info' as 'success' | 'error' | 'info' | 'warning' })

watchEffect(async () => {
  // Only redirect non-anonymous authenticated users
  if (user.value && !isAnonymous.value) {
    const redirectPath = route.query.redirect as string
    await navigateTo(redirectPath || '/')
  }
})

const handleSignUp = async () => {
  const trimmedUsername = username.value.trim()
  const trimmedEmail = email.value.trim()
  const currentPassword = password.value

  // 1. Required Fields Check
  if (!trimmedUsername || !trimmedEmail || !currentPassword) {
    feedback.value = { message: `Please fill in all required fields.`, type: 'error' }
    return
  }

  // 2. Password Strength Validation
  if (currentPassword.length < 6) {
    feedback.value = { message: 'Password must be at least 6 characters long', type: 'error' }
    return
  }

  // 3. Password Complexity Check
  const hasLetter = /[a-zA-Z]/.test(currentPassword)
  const hasDigit = /\d/.test(currentPassword)

  if (!hasLetter || !hasDigit) {
    feedback.value = {
      message: 'Password must contain at least one letter and one number',
      type: 'error',
    }
    return
  }

  // 4. Captcha Check
  if (!token.value) {
    feedback.value = { message: 'Please complete the security check', type: 'warning' }
    return
  }

  loading.value = true
  const startTime = Date.now()

  const { error } = await register({
    email: trimmedEmail,
    password: currentPassword,
    username: trimmedUsername,
    captchaToken: token.value,
  })

  // Ensure minimum loading time
  const elapsedTime = Date.now() - startTime
  const minDelay = 1000 // 1 second
  if (elapsedTime < minDelay) {
    await new Promise(resolve => setTimeout(resolve, minDelay - elapsedTime))
  }

  loading.value = false

  if (error) {
    // Handle specific Supabase error messages
    if (error.message.includes('Unable to validate email address')) {
      feedback.value = { message: 'Please enter a valid email address.', type: 'error' }
    } else if (
      error.message.includes('A user with this email address has already been registered')
    ) {
      // Prevent email enumeration: Show success message even if user exists
      feedback.value = {
        message: 'Account created! Please check your email to confirm your account.',
        type: 'success',
      }
    } else {
      // For other errors (e.g. database issues), show a generic error
      feedback.value = {
        message: 'An error occurred during registration. Please try again.',
        type: 'error',
      }
    }
  } else {
    // Success message for both conversion and new signup
    feedback.value = {
      message: 'Account created! Please check your email to confirm your account.',
      type: 'success',
    }
  }
}

const handleAnonymousSignIn = async () => {
  anonymousLoading.value = true
  const { error } = await signInAnonymously()
  if (error) {
    anonymousLoading.value = false
    feedback.value = { message: error.message, type: 'error' }
  } else {
    // Successfully signed in as anonymous - navigate to home
    const redirectPath = route.query.redirect as string
    await navigateTo(redirectPath || '/')
  }
}
</script>
