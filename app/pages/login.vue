<template>
  <div>
    <v-card-title class="text-h4 mb-4">Sign in</v-card-title>
    
    <v-form @submit.prevent="login">
      <ErrorAlert :error-msg="authError" @clearError="clearError" />
      
      <v-text-field
        v-model="email"
        label="Email address"
        type="email"
        variant="outlined"
        class="mb-3"
      />
      
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        variant="outlined"
        class="mb-3"
      />
      
      <v-btn
        type="submit"
        color="primary"
        block
        :loading="loading"
        class="mb-3"
      >
        Sign in
      </v-btn>
      
      <v-btn
        to="/forgot-password"
        variant="text"
        block
        class="mb-4"
      >
        Forgot your password?
      </v-btn>
    </v-form>
    
    <v-divider class="my-4" />
    
    <div class="text-center">
      <p class="mb-3">Don't have an account?</p>
      <v-btn
        to="/register"
        variant="outlined"
        block
      >
        Create new account
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
});

useHead({
  title: 'Login | supaAuth',
});

const user = useSupabaseUser();
const loading = ref(false);
const authError = ref('');
const email = ref('');
const password = ref('');
const client = useSupabaseClient();

watchEffect(async () => {
  if (user.value) {
    await navigateTo('/');
  }
});

const login = async () => {
  loading.value = true;
  const { error } = await client.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });
  if (error) {
    loading.value = false;
    authError.value = error.message;
    setTimeout(() => {
      authError.value = '';
    }, 5000);
  }
};

const clearError = () => {
  authError.value = '';
};
</script>
