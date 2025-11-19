<template>
  <div class="d-flex justify-center">
    <v-card class="pa-12 d-flex flex-column ga-8" width="600" outlined>
      <v-card-title class="text-h4 py-0">
        {{ isAnonymous ? 'Create Your Account' : 'Sign up' }}
      </v-card-title>

      <v-form class="d-flex flex-column ga-4" @submit.prevent="handleSignUp">
        <AppAlert
          v-if="isAnonymous"
          type="info"
          message="You're currently in Guest Mode. Sign up to secure your progress!"
          :closable="false"
        >
        </AppAlert>

        <AppAlert
          v-if="feedback.message"
          :message="feedback.message"
          :type="feedback.type"
          @clear="clearFeedback"
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

        <v-btn type="submit" color="primary" class="mt-4" block :loading="loading"> Sign up </v-btn>
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
        Continue as Guest
      </v-btn>

      <div class="text-center text-body-2 text-medium-emphasis">
        <p>
          Already have an account?
          <NuxtLink to="/login" class="text-decoration-none text-primary">Log in</NuxtLink>
        </p>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Register | NACC',
})

const { isAnonymous, register, signInAnonymously } = useAuth()
const username = ref('')
const email = ref('')
const password = ref('')
const user = useSupabaseUser()
const loading = ref(false)
const anonymousLoading = ref(false)
const feedback = ref({ message: '', type: 'info' as 'success' | 'error' | 'info' | 'warning' })

watchEffect(async () => {
  // Only redirect non-anonymous authenticated users
  if (user.value && !isAnonymous.value) {
    await navigateTo('/')
  }
})

const handleSignUp = async () => {
  const trimmedUsername = username.value.trim()
  const trimmedEmail = email.value.trim()
  const currentPassword = password.value

  if (!trimmedUsername || !trimmedEmail || !currentPassword) {
    feedback.value = { message: `Please fill in all required fields.`, type: 'error' }
    return
  }

  if (currentPassword.length < 6) {
    feedback.value = { message: 'Password must be at least 6 characters long', type: 'error' }
    return
  }

  // Check for letters and digits
  const hasLetter = /[a-zA-Z]/.test(currentPassword)
  const hasDigit = /\d/.test(currentPassword)

  if (!hasLetter || !hasDigit) {
    feedback.value = {
      message: 'Password must contain at least one letter and one number',
      type: 'error',
    }
    return
  }

  loading.value = true
  const startTime = Date.now()

  const { error } = await register({
    email: trimmedEmail,
    password: currentPassword,
    username: trimmedUsername,
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
    if (error.message.includes('Unable to validate email address: invalid format')) {
      feedback.value = { message: 'Please enter a valid email address.', type: 'error' }
    } else {
      feedback.value = { message: error.message, type: 'error' }
    }
  } else {
    // Success message for both conversion and new signup
    feedback.value = {
      message: 'Account created! Please check your email to confirm your account.',
      type: 'success',
    }
  }
}

const clearFeedback = () => {
  feedback.value.message = ''
}

const handleAnonymousSignIn = async () => {
  anonymousLoading.value = true
  const { error } = await signInAnonymously()
  if (error) {
    anonymousLoading.value = false
    feedback.value = { message: error.message, type: 'error' }
  } else {
    // Successfully signed in as anonymous - navigate to home
    await navigateTo('/')
  }
}
</script>
