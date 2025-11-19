<template>
  <v-alert v-if="successMsg" type="success" variant="tonal" closable @click:close="clearSuccess">
    {{ successMsg }}
  </v-alert>
</template>

<script setup lang="ts">
defineProps<{ successMsg: String }>()
const emit = defineEmits(['clearSuccess'])
const clearSuccess = () => {
  emit('clearSuccess')
}
</script>

<style scoped>
.v-alert {
  min-height: fit-content;
}
</style>
