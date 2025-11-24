<template>
  <Checklist
    title="Novels"
    :items="novels"
    :loading="loading"
    :error="error"
    :headers="headers"
    :is-completed="isCompleted"
    :on-toggle="handleToggle"
  />
</template>

<script lang="ts" setup>
useHead({
  title: 'Novels | Pod Data',
})

import type { Header } from '~/components/Checklist.vue'

const { getAllNovelsWithStatus, toggleNovel } = useNovels()
const {
  items: novels,
  loading,
  error,
  isCompleted,
  handleToggle,
} = useChecklist(getAllNovelsWithStatus, toggleNovel, 'user_novels')

const headers: Header[] = [
  { title: 'Name', key: 'name', width: '25%' },
  { title: 'Acquisition', key: 'acquisition' },
]
</script>

<style></style>
