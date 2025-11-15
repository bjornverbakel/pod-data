<template>
  <div>
    <v-card-title class="text-h4 mb-4">New password</v-card-title>
    
    <v-form @submit.prevent="updatepassword">
      <ErrorAlert :error-msg="authError" @clearError="clearError" />
      <SuccessAlert :success-msg="authSuccess" @clearSuccess="clearSuccess" />
      
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        variant="outlined"
        class="mb-3"
      />
      
      <v-text-field
        v-model="passwordConfirm"
        label="Repeat password"
        type="password"
        variant="outlined"
        class="mb-3"
      />
      
      <v-btn
        type="submit"
        color="primary"
        block
        :loading="loading"
      >
        Save
      </v-btn>
    </v-form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
});

useHead({
  title: 'New Password | supaAuth',
});

const password = ref('');
const passwordConfirm = ref('');
const client = useSupabaseClient();
const loading = ref(false);
const authSuccess = ref('');
const authError = ref('');

const updatepassword = async () => {
  if (password.value !== passwordConfirm.value) {
    authError.value = 'Password mismatch!';
    return;
  }
  loading.value = true;
  const { error } = await client.auth.updateUser({
    password: password.value,
  });
  await client.auth.signOut();
  if (error) {
    loading.value = false;
    authError.value = error.message;
    setTimeout(() => {
      authError.value = '';
    }, 5000);
  } else {
    loading.value = false;
    authSuccess.value = 'Password changed';
    setTimeout(() => {
      authSuccess.value = '';
      navigateTo('/login');
    }, 5000);
  }
};

const clearError = () => {
  authError.value = '';
};

const clearSuccess = () => {
  authSuccess.value = '';
  navigateTo('/login');
};
</script>
