<template>
  <Checklist
    title="Novels"
    :items="novels"
    :loading="loading"
    v-model:feedback="feedback"
    :headers="headers"
    :is-completed="isCompleted"
    :on-toggle="handleToggle"
  />
</template>

<script lang="ts" setup>
useHead({
  title: 'Novels',
})

import type { Header } from '~/components/Checklist.vue'

const { getAllNovelsWithStatus, toggleNovel } = useNovels()
const {
  items: novels,
  loading,
  feedback,
  isCompleted,
  handleToggle,
} = useChecklist(getAllNovelsWithStatus, toggleNovel, 'user_novels')

const headers: Header[] = [
  { title: 'Name', key: 'name', width: '25%' },
  { title: 'Acquisition', key: 'acquisition' },
]
</script>

<style></style>
