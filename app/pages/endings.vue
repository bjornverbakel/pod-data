<template>
  <AppChecklist
    title="Endings"
    :items="endings"
    :loading="loading"
    :error="error"
    :headers="headers"
    :is-completed="isCompleted"
    :on-toggle="handleToggle"
  />
</template>

<script lang="ts" setup>
import type { Header } from '~/components/AppChecklist.vue'

const { getAllEndingsWithStatus, toggleEnding } = useEndings()

const {
  items: endings,
  loading,
  error,
  isCompleted,
  handleToggle,
} = useChecklist(getAllEndingsWithStatus, toggleEnding, 'user_endings')

const headers: Header[] = [
  { title: 'Letter', key: 'letter', width: '1%' },
  { title: 'Name', key: 'name' },
  { title: 'Chapter', key: 'chapter', width: '20%' },
  { title: 'Type', key: 'type', width: '10%' },
]
</script>

<style></style>
