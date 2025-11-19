<template>
  <v-alert v-if="errorMsg" type="error" variant="tonal" closable @click:close="clearError">
    {{ errorMsg }}
  </v-alert>
</template>

<script setup lang="ts">
defineProps<{ errorMsg: String }>()
const emit = defineEmits(['clearError'])
const clearError = () => {
  emit('clearError')
}
</script>

<style scoped>
.v-alert {
  min-height: fit-content;
}
</style>
