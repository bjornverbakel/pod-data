<template>
  <div>
    <v-card-title class="text-h4 mb-4">Forgot password</v-card-title>
    
    <v-form @submit.prevent="resetPassword">
      <ErrorAlert :error-msg="authError" @clearError="clearError" />
      <SuccessAlert :success-msg="authSuccess" @clearSuccess="clearSuccess" />
      
      <v-text-field
        v-model="email"
        label="Email address"
        type="email"
        variant="outlined"
        class="mb-3"
      />
      
      <v-btn
        type="submit"
        color="primary"
        block
        :loading="loading"
      >
        Request reset link
      </v-btn>
    </v-form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
});

useHead({
  title: 'Forgot Password | supaAuth',
});

const email = ref('');
const client = useSupabaseClient();
const loading = ref(false);
const authSuccess = ref('');
const authError = ref('');

const resetPassword = async () => {
  loading.value = true;
  const { error } = await client.auth.resetPasswordForEmail(email.value, {
    redirectTo: `${window.location.origin}/new-password`,
  });
  if (error) {
    loading.value = false;
    authError.value = error.message;
    setTimeout(() => {
      authError.value = '';
    }, 5000);
  } else {
    loading.value = false;
    authSuccess.value = "We've sent you an email.";
    setTimeout(() => {
      authSuccess.value = '';
    }, 5000);
  }
};

const clearError = () => {
  authError.value = '';
};

const clearSuccess = () => {
  authSuccess.value = '';
};
</script>
