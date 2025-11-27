<template>
  <Checklist
    title="Archives"
    :items="archives"
    :loading="loading"
    v-model:feedback="feedback"
    :headers="headers"
    :is-completed="isCompleted"
    :on-toggle="handleToggle"
    group-by="type"
    :group-order="[
      'Pearl Harbor Descent Records',
      'Saved Machine Records',
      'Engel\'s Memories',
      'Data Saved on Server',
      'Old World Information',
    ]"
  />
</template>

<script lang="ts" setup>
useHead({
  title: 'Archives',
})

import type { Header } from '~/components/Checklist.vue'

const { getAllArchivesWithStatus, toggleArchive } = useArchives()

const {
  items: archives,
  loading,
  feedback,
  isCompleted,
  handleToggle,
} = useChecklist(getAllArchivesWithStatus, toggleArchive, 'user_archives')

const headers: Header[] = [{ title: 'Name', key: 'name' }]
</script>

<style></style>
