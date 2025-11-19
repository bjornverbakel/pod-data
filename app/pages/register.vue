<template>
  <div class="d-flex justify-center">
    <v-card class="pa-12 d-flex flex-column ga-8" width="600" outlined>
      <v-card-title class="text-h4 py-0">
        {{ isAnonymous ? 'Create Your Account' : 'Sign up' }}
      </v-card-title>

      <v-alert v-if="isAnonymous && !authSuccess && !authError" type="info" density="compact">
        You're currently in Guest Mode. Sign up to secure your progress!
      </v-alert>

      <v-form class="d-flex flex-column ga-4" @submit.prevent="signUp">
        <ErrorAlert :error-msg="authError" @clearError="clearError" />
        <SuccessAlert :success-msg="authSuccess" @clearSuccess="clearSuccess" />

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

        <v-btn type="submit" color="primary" block :loading="loading"> Sign up </v-btn>
      </v-form>

      <div v-if="!isAnonymous" class="d-flex align-center">
        <v-divider />
        <span class="mx-4">Or</span>
        <v-divider />
      </div>

      <v-btn
        v-if="!isAnonymous"
        @click="signInAnonymously"
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
  title: 'Register | supaAuth',
})

const { isAnonymous, convertAnonymousToUser } = useAuth()
const username = ref('')
const email = ref('')
const password = ref('')
const client = useSupabaseClient()
const user = useSupabaseUser()
const loading = ref(false)
const anonymousLoading = ref(false)
const authError = ref('')
const authSuccess = ref('')

watchEffect(async () => {
  // Only redirect non-anonymous authenticated users
  if (user.value && !isAnonymous.value) {
    await navigateTo('/')
  }
})

const signUp = async () => {
  if (!username.value || !email.value || !password.value) {
    authError.value = 'Please fill in all required fields.'
    return
  }

  loading.value = true

  // If user is anonymous, convert them instead of creating a new account
  if (isAnonymous.value) {
    const { error } = await convertAnonymousToUser({
      email: email.value,
      password: password.value,
      username: username.value,
    })

    loading.value = false

    if (error) {
      authError.value = error.message
    } else {
      // Email confirmation is required
      authSuccess.value = 'Account created! Please check your email to confirm your account.'
    }
  } else {
    // Normal sign up flow
    const { data, error } = await client.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          username: username.value,
          full_name: username.value,
        },
      },
    })

    loading.value = false

    if (error) {
      authError.value = error.message
    } else if (data?.user && !data.session) {
      // Email confirmation is required
      authSuccess.value = 'Account created! Please check your email to confirm your account.'
    }
  }
}

const clearError = () => {
  authError.value = ''
}

const clearSuccess = () => {
  authSuccess.value = ''
}

const signInAnonymously = async () => {
  anonymousLoading.value = true
  const { error } = await client.auth.signInAnonymously()
  if (error) {
    anonymousLoading.value = false
    authError.value = error.message
    setTimeout(() => {
      authError.value = ''
    }, 5000)
  } else {
    // Successfully signed in as anonymous - navigate to home
    await navigateTo('/')
  }
}
</script>
