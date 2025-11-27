<template>
  <Checklist
    title="Fish"
    :items="fish"
    :loading="loading"
    v-model:feedback="feedback"
    :headers="headers"
    :is-completed="isCompleted"
    :on-toggle="handleToggle"
  >
    <template #location="{ item }">
      <div class="d-flex flex-column ga-1 py-2">
        <div v-for="loc in item.location" :key="loc">
          {{ splitLocation(loc).main }}
          <span class="text-medium-emphasis">{{ splitLocation(loc).sub }}</span>
        </div>
      </div>
    </template>
  </Checklist>
</template>

<script lang="ts" setup>
useHead({
  title: 'Fish',
})

import type { Header } from '~/components/Checklist.vue'

const { getAllFishWithStatus, toggleFish } = useFish()
const {
  items: fish,
  loading,
  feedback,
  isCompleted,
  handleToggle,
} = useChecklist(getAllFishWithStatus, toggleFish, 'user_fish')

const headers: Header[] = [
  { title: 'Name', key: 'name', width: '15%' },
  { title: 'Location', key: 'location', slot: 'location' },
]

const splitLocation = (loc: string) => {
  const index = loc.indexOf('(')
  if (index === -1) return { main: loc, sub: '' }
  return {
    main: loc.slice(0, index),
    sub: loc.slice(index),
  }
}
</script>

<style></style>
