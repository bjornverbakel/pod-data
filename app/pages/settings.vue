<template>
  <div class="section-spacing">
    <h1 class="main-header">Settings</h1>

    <ImportGameSave />

    <ManageCompletionData />

    <AccountSettings v-if="!isAnonymous && user" />

    <DangerZone v-if="user" />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Settings',
})

const { isAnonymous } = useAuth()
const user = useSupabaseUser()
</script>
