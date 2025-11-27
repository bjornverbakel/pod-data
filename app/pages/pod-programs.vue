<template>
  <Checklist
    title="Pod Programs"
    :items="podPrograms"
    :loading="loading"
    v-model:feedback="feedback"
    :headers="headers"
    :is-completed="isCompleted"
    :on-toggle="handleToggle"
  />
</template>

<script lang="ts" setup>
useHead({
  title: 'Pod Programs',
})

import type { Header } from '~/components/Checklist.vue'

const { getAllPodProgramsWithStatus, togglePodProgram } = usePodPrograms()
const {
  items: podPrograms,
  loading,
  feedback,
  isCompleted,
  handleToggle,
} = useChecklist(getAllPodProgramsWithStatus, togglePodProgram, 'user_pod_programs')

const headers: Header[] = [
  { title: 'Name', key: 'name', width: '15%' },
  { title: 'Acquisition', key: 'acquisition' },
]
</script>

<style></style>
