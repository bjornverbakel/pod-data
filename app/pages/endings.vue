<template>
  <Checklist
    title="Endings"
    :items="endings"
    :loading="loading"
    v-model:feedback="feedback"
    :headers="headers"
    :is-completed="isCompleted"
    :on-toggle="handleToggle"
    group-by="type"
    :group-order="['Main', 'Hidden', 'DLC']"
  />
</template>

<script lang="ts" setup>
useHead({
  title: 'Endings',
})

import type { Header } from '~/components/Checklist.vue'

const { getAllEndingsWithStatus, toggleEnding } = useEndings()

const {
  items: endings,
  loading,
  feedback,
  isCompleted,
  handleToggle,
} = useChecklist(getAllEndingsWithStatus, toggleEnding, 'user_endings')

const headers: Header[] = [
  { title: 'Letter', key: 'letter', width: '1%' },
  { title: 'Name', key: 'name' },
  { title: 'Chapter', key: 'chapter', width: '20%' },
]
</script>

<style></style>
