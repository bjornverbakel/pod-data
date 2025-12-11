<template>
  <div class="d-flex justify-center auth-main-content h-screen-content align-center">
    <v-card class="d-flex flex-column justify-center" width="600">
      <div class="section-spacing pa-4 pa-sm-16">
        <v-card-title class="text-h4 pa-0 text-truncate-wrap">
          {{ route.query.type === 'recovery' ? 'Reset Password' : 'Change Password' }}
        </v-card-title>

        <UpdatePasswordForm :redirect-to-login="true" button-text="Reset Password" />
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

useHead({
  title: computed(() => (route.query.type === 'recovery' ? 'Reset Password' : 'Change Password')),
})

definePageMeta({ authLayout: true })
</script>
