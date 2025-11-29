<template>
  <div class="d-flex flex-column ga-4">
    <p class="text-body-1">
      <slot name="message">
        A link has been sent to <strong>{{ email }}</strong
        >. Please check your inbox.
      </slot>
    </p>

    <div class="d-flex align-center ga-2 text-warning">
      <v-icon icon="mdi-folder-alert-outline" />
      <p>You may need to check your spam folder.</p>
    </div>

    <v-divider class="my-4" />

    <div class="d-flex align-center ga-2">
      <span class="text-body-1">Didn't receive an email?</span>

      <v-btn
        variant="text"
        color="primary"
        density="comfortable"
        :loading="loading"
        @click="$emit('action')"
        class="w-fit"
      >
        {{ actionLabel }}
      </v-btn>
    </div>

    <AppAlert
      v-if="feedback?.message"
      :message="feedback.message"
      @update:message="$emit('update:feedback', { ...feedback, message: $event })"
      :type="feedback.type"
    />

    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
interface Feedback {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

withDefaults(
  defineProps<{
    email: string
    loading?: boolean
    actionLabel?: string
    feedback?: Feedback
  }>(),
  {
    loading: false,
    actionLabel: 'Resend',
  }
)

defineEmits<{
  (e: 'action'): void
  (e: 'update:feedback', value: Feedback): void
}>()
</script>
