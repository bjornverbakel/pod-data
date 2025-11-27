<template>
  <Checklist
    title="Sidequests"
    :items="sidequests"
    :loading="loading"
    v-model:feedback="feedback"
    :headers="headers"
    :is-completed="isCompleted"
    :on-toggle="handleToggle"
  >
    <template #clearable-by="{ item }">
      <div style="display: flex; gap: 0.25rem">
        <v-chip
          v-for="char in sortCharacters(item.clearable_by)"
          :key="char"
          size="small"
          :color="getCharacterColor(char)"
          variant="flat"
        >
          {{ char }}
        </v-chip>
      </div>
    </template>

    <template #client-location="{ item }">
      {{ item.client }}
      <span class="text-medium-emphasis">({{ item.location }})</span>
    </template>
  </Checklist>
</template>

<script lang="ts" setup>
useHead({
  title: 'Sidequests',
})

import type { Header } from '~/components/Checklist.vue'

const { getAllSidequestsWithStatus, toggleSidequest } = useSidequests()

const {
  items: sidequests,
  loading,
  feedback,
  isCompleted,
  handleToggle,
} = useChecklist(getAllSidequestsWithStatus, toggleSidequest, 'user_sidequests')

const headers: Header[] = [
  { title: 'Name', key: 'name' },
  { title: 'Clearable By', slot: 'clearable-by', width: '16%' },
  { title: 'Client / Location', slot: 'client-location', width: '25%' },
  { title: 'Chapter', key: 'chapter', width: '15%' },
]
const getCharacterColor = (char: string) => {
  switch (char) {
    case '2B':
      return 'blue-lighten-1'
    case '9S':
      return 'green-lighten-1'
    case 'A2':
      return 'red-lighten-1'
    default:
      return 'primary'
  }
}

const sortCharacters = (chars: string[] | null) => {
  if (!chars) return []
  const order = ['2B', '9S', 'A2']
  return [...chars].sort((a, b) => {
    const indexA = order.indexOf(a)
    const indexB = order.indexOf(b)
    // If not found in order array, put at the end
    const valA = indexA === -1 ? 999 : indexA
    const valB = indexB === -1 ? 999 : indexB
    return valA - valB
  })
}

// Fetch on mount and when user changes
// Handled by useChecklist
</script>
