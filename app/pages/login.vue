<template>
  <div class="d-flex justify-center">
    <v-card class="pa-12 d-flex flex-column ga-8" width="600" outlined>
      <v-card-title class="text-h4 py-0">Log in</v-card-title>

      <v-form class="d-flex flex-column ga-4" @submit.prevent="handleLogin">
        <AppAlert
          v-if="isAnonymous"
          type="warning"
          message="You're currently in Guest Mode. If you wish to keep your guest progress, please sign up instead."
          :closable="false"
        />

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

        <div class="text-right">
          <v-text-field
            v-model="password"
            prepend-inner-icon="mdi-lock"
            label="Password"
            type="password"
            class="mb-1"
          />

          <NuxtLink to="/forgot-password" class="text-primary text-decoration-none text-body-2">
            Forgot password?
          </NuxtLink>
        </div>

        <v-btn type="submit" color="primary" block :loading="loading">Log in</v-btn>
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
          Don't have an account?
          <NuxtLink to="/register" class="text-decoration-none text-primary">Sign up</NuxtLink>
        </p>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Login | NACC',
})

const { isAnonymous, login, signInAnonymously } = useAuth()
const user = useSupabaseUser()
const loading = ref(false)
const anonymousLoading = ref(false)
const feedback = ref({ message: '', type: 'info' as 'success' | 'error' | 'info' | 'warning' })
const email = ref('')
const password = ref('')

watchEffect(async () => {
  // Only redirect non-anonymous authenticated users
  if (user.value && !isAnonymous.value) {
    await navigateTo('/')
  }
})

const handleLogin = async () => {
  const trimmedEmail = email.value.trim()
  const currentPassword = password.value

  if (!trimmedEmail || !currentPassword) {
    let missing = []
    if (!trimmedEmail) missing.push('email')
    if (!currentPassword) missing.push('password')
    feedback.value = { message: `Missing: ${missing.join(', ')}`, type: 'error' }
    return
  }
  loading.value = true
  const startTime = Date.now()

  const { error } = await login(trimmedEmail, currentPassword)

  // Ensure minimum loading time
  const elapsedTime = Date.now() - startTime
  const minDelay = 1000 // 1 second
  if (elapsedTime < minDelay) {
    await new Promise(resolve => setTimeout(resolve, minDelay - elapsedTime))
  }

  loading.value = false

  if (error) {
    feedback.value = { message: error.message, type: 'error' }
  } else {
    feedback.value = { message: 'Login successful!', type: 'success' }
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

<style scoped lang="scss">
.main-content {
  justify-content: center;
  align-items: center;
}
</style>
