<template>
  <v-alert
    v-if="errorMsg"
    type="error"
    variant="tonal"
    closable
    @click:close="clearError"
    class="mb-4"
  >
    {{ errorMsg }}
  </v-alert>
</template>

<script setup lang="ts">
defineProps<{ errorMsg: String }>();
const emit = defineEmits(['clearError']);
const clearError = () => {
  emit('clearError');
};
</script>
