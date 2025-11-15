<template>
  <div>
    <v-card-title class="text-h4 mb-4">Create an account</v-card-title>
    
    <v-form @submit.prevent="signUp">
      <ErrorAlert :error-msg="authError" @clearError="clearError" />
      
      <v-text-field
        v-model="name"
        label="First name"
        type="text"
        variant="outlined"
        class="mb-3"
      />
      
      <v-text-field
        v-model="lastname"
        label="Last name"
        type="text"
        variant="outlined"
        class="mb-3"
      />
      
      <v-text-field
        v-model="company"
        label="Company (Optional)"
        type="text"
        variant="outlined"
        class="mb-3"
      />
      
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
        Sign up
      </v-btn>
      
      <v-card-text class="text-caption text-center">
        By signing up you agree to our
        <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">API Terms of Service</a>
        and
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
      </v-card-text>
    </v-form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
});

useHead({
  title: 'Register | supaAuth',
});

const email = ref('');
const password = ref('');
const name = ref('');
const lastname = ref('');
const company = ref('');
const client = useSupabaseClient();
const user = useSupabaseUser();
const loading = ref(false);
const authError = ref('');

watchEffect(async () => {
  if (user.value) {
    await navigateTo('/');
  }
});

const signUp = async () => {
  if (!name.value) return (authError.value = 'First name required');
  if (!lastname.value) return (authError.value = 'Last name required');
  loading.value = true;
  const { error } = await client.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        first_name: name.value,
        last_name: lastname.value,
        company: company.value,
      },
    },
  });
  if (error) {
    loading.value = false;
    authError.value = error.message;
  }
};

const clearError = () => {
  authError.value = '';
};
</script>
