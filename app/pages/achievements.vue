<template>
  <Checklist
    title="Achievements"
    :items="achievements"
    :loading="loading"
    v-model:feedback="feedback"
    :headers="headers"
    :is-completed="isCompleted"
    :on-toggle="handleToggle"
  >
    <template #icon_url="{ item }">
      <v-img height="60" width="60" class="my-4" :src="item.icon_url" :alt="item.name" />
    </template>
  </Checklist>
</template>

<script lang="ts" setup>
useHead({
  title: 'Achievements',
})

import type { Header } from '~/components/Checklist.vue'

const { getAllAchievementsWithStatus, toggleAchievement } = useAchievements()

const {
  items: achievements,
  loading,
  feedback,
  isCompleted,
  handleToggle,
} = useChecklist(getAllAchievementsWithStatus, toggleAchievement, 'user_achievements')

const headers: Header[] = [
  { title: 'Icon', key: 'icon_url', width: '1%', slot: 'icon_url' },
  { title: 'Name', key: 'name', width: '25%' },
  { title: 'Description', key: 'description' },
]
</script>

<style></style>
