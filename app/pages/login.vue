<template>
  <div class="d-flex justify-center auth-main-content h-screen-content align-center">
    <v-card class="d-flex flex-column justify-center" width="600">
      <div class="section-spacing pa-4 pa-sm-16">
        <v-card-title class="text-h4 pa-0 text-truncate-wrap">Log in</v-card-title>

        <v-form class="d-flex flex-column ga-4" @submit.prevent="handleLogin">
          <AppAlert
            v-if="isAnonymous"
            type="warning"
            message="You're currently in Guest Mode. If you wish to keep your guest progress, please sign up instead."
            :closable="false"
          />

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

          <v-expand-transition>
            <div v-if="showCaptcha" class="mx-auto text-center">
              <div class="text-caption text-warning mb-1">
                Security check required due to multiple failed attempts.
              </div>
              <NuxtTurnstile v-model="token" />
            </div>
          </v-expand-transition>

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
          <span class="text-truncate-wrap">Continue as Guest</span>
        </v-btn>

        <div class="text-center text-body-2 text-medium-emphasis">
          <p>
            Don't have an account?
            <NuxtLink
              :to="{ path: '/register', query: route.query }"
              class="text-decoration-none text-primary"
              >Sign up</NuxtLink
            >
          </p>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Login',
})

definePageMeta({ authLayout: true })

// defineOgImageComponent('Nuxt', {
//   title: 'Nuxt Commerce',
//   description: 'A high-performance, server-rendered E-commerce app built with Nuxt & Shopify',
//   theme: '#4ADE80',
//   headline: '',
//   colorMode: 'dark',
// })

const { isAnonymous, login, signInAnonymously } = useAuth()
const user = useSupabaseUser()
const failedAttempts = ref(0)
const MAX_ATTEMPTS_BEFORE_CAPTCHA = 5 // Show captcha after 5 fails
const showCaptcha = computed(() => failedAttempts.value >= MAX_ATTEMPTS_BEFORE_CAPTCHA)
const loading = ref(false)
const anonymousLoading = ref(false)
const feedback = ref({ message: '', type: 'info' as 'success' | 'error' | 'info' | 'warning' })
const email = ref('')
const password = ref('')
const token = ref('')
const route = useRoute()

watchEffect(async () => {
  // Only redirect non-anonymous authenticated users
  if (user.value && !isAnonymous.value) {
    const redirectPath = route.query.redirect as string
    await navigateTo(redirectPath || '/')
  }
})

const handleLogin = async () => {
  const trimmedEmail = email.value.trim()
  const currentPassword = password.value

  // 1. Required Fields Check
  if (!trimmedEmail || !currentPassword) {
    feedback.value = { message: 'Please fill in all required fields.', type: 'error' }
    return
  }

  // 2. Conditional Captcha Check
  if (showCaptcha.value && !token.value) {
    feedback.value = { message: 'Please complete the security check', type: 'error' }
    return
  }

  loading.value = true
  const startTime = Date.now()

  // 3. Pass token only if we are showing the captcha
  const tokenToSend = showCaptcha.value ? token.value : undefined
  const { error } = await login(trimmedEmail, currentPassword, tokenToSend)

  // Ensure minimum loading time
  const elapsedTime = Date.now() - startTime
  const minDelay = 1000 // 1 second
  if (elapsedTime < minDelay) {
    await new Promise(resolve => setTimeout(resolve, minDelay - elapsedTime))
  }

  loading.value = false

  if (error) {
    // 4. Increment failure counter on error
    failedAttempts.value++
    token.value = '' // Reset token so they must do it again if visible

    // Handle specific Supabase error messages
    if (error.message.includes('Invalid login credentials')) {
      feedback.value = { message: 'Incorrect email or password.', type: 'error' }
    } else {
      feedback.value = { message: error.message, type: 'error' }
    }
  } else {
    feedback.value = { message: 'Login successful!', type: 'success' }
    failedAttempts.value = 0 // Reset on success
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

<style scoped lang="scss">
.main-content {
  justify-content: center;
  align-items: center;
}
</style>
