<template>
  <div class="d-flex justify-center auth-main-content h-screen-content align-center">
    <v-card class="d-flex flex-column justify-center" width="600">
      <div class="section-spacing pa-4 pa-sm-16">
        <v-card-title class="text-h4 pa-0 text-truncate-wrap">
          {{
            isAnonymous
              ? 'Create Your Account'
              : registrationSuccess
                ? 'Verify your email'
                : 'Sign up'
          }}
        </v-card-title>

        <div v-if="registrationSuccess">
          <EmailSentState
            :email="email"
            :loading="resendLoading"
            :feedback="feedback"
            @update:feedback="feedback = $event"
            @action="handleResend"
          >
            <template #message>
              A link has been sent to <strong>{{ email }}</strong
              >. Please check your inbox to verify your email address and activate your account.
              This link will expire in 1 hour.
            </template>
          </EmailSentState>
        </div>

        <template v-else>
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
              :hide-details="false"
              persistent-hint
              hint="Allowed: [a-z], [0-9], underscore (_), and hyphen (-). Max length of 32."
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
        </template>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import EmailSentState from '~/components/auth/EmailSentState.vue'

useHead({
  title: 'Register',
})

definePageMeta({ authLayout: true })

const { isAnonymous, register, signInAnonymously, resendVerification } = useAuth()
const {
  validateRequired,
  validatePassword,
  validateCaptcha,
  validateEmail,
  validateUsername,
  resolveAuthError,
} = useAuthValidation()
const username = ref('')
const email = ref('')
const password = ref('')
const token = ref('')
const user = useSupabaseUser()
const route = useRoute()
const loading = ref(false)
const anonymousLoading = ref(false)
const resendLoading = ref(false)
const registrationSuccess = ref(false)
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

  const requiredError = validateRequired({
    username: trimmedUsername,
    email: trimmedEmail,
    password: currentPassword,
  })
  if (requiredError) {
    feedback.value = { message: requiredError, type: 'error' }
    return
  }

  const usernameError = validateUsername(trimmedUsername)
  if (usernameError) {
    feedback.value = { message: usernameError, type: 'error' }
    return
  }

  const emailError = validateEmail(trimmedEmail)
  if (emailError) {
    feedback.value = { message: emailError, type: 'error' }
    return
  }

  const passwordError = validatePassword(currentPassword)
  if (passwordError) {
    feedback.value = { message: passwordError, type: 'error' }
    return
  }

  const captchaError = validateCaptcha(token.value)
  if (captchaError) {
    feedback.value = { message: captchaError, type: 'warning' }
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
    }
  } else {
    // Success message for both conversion and new signup
    registrationSuccess.value = true
    feedback.value = { message: '', type: 'info' } // Clear feedback as we show the success view
  }
}

const handleResend = async () => {
  resendLoading.value = true
  const { error } = await resendVerification(email.value)
  resendLoading.value = false

  if (error) {
    feedback.value = { message: resolveAuthError(error)!, type: 'error' }
  } else {
    feedback.value = { message: 'Verification email resent.', type: 'success' }
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
