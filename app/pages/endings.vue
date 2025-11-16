<template>
  <h1 class="main-header">Endings</h1>

  <v-alert v-if="error" type="error" class="mb-4">
    {{ error }}
  </v-alert>

  <v-skeleton-loader v-if="loading" type="table" />

  <v-table :hover="!!user" fixedHeader height="600" v-else>
    <thead>
      <tr>
        <th>Completed</th>
        <th>Letter</th>
        <th>Name</th>
        <th>Chapter</th>
        <th>Type</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="ending in endings"
        :key="ending.id"
        @click="user && handleToggle(ending, !isCompleted(ending))"
        :style="{ cursor: user ? 'pointer' : 'default' }"
      >
        <td>
          <v-checkbox
            :model-value="isCompleted(ending)"
            @update:model-value="val => handleToggle(ending, val)"
            hide-details
            :disabled="!user"
          />
        </td>
        <td>{{ ending.letter }}</td>
        <td>{{ ending.name }}</td>
        <td>{{ ending.chapter }}</td>
        <td>{{ ending.type }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts" setup>
const { getAllEndingsWithStatus, toggleEnding } = useEndings()
const user = useSupabaseUser()

const endings = ref<any[]>([])
const loading = ref(true)
const error = ref('')

const fetchEndings = async () => {
  error.value = ''

  const { data, error: fetchError } = await getAllEndingsWithStatus()

  if (fetchError) {
    error.value = fetchError.message
  } else if (data) {
    endings.value = data
  }

  loading.value = false
}

const isCompleted = (ending: any) => {
  if (!ending.user_endings || ending.user_endings.length === 0) {
    return false
  }
  return ending.user_endings[0]?.completed || false
}

const handleToggle = async (ending: any, completed: boolean) => {
  // Optimistic update
  const index = endings.value.findIndex(e => e.id === ending.id)
  if (index !== -1) {
    if (!endings.value[index].user_endings || endings.value[index].user_endings.length === 0) {
      endings.value[index].user_endings = [{ completed, completed_at: null }]
    } else {
      endings.value[index].user_endings[0].completed = completed
      endings.value[index].user_endings[0].completed_at = completed
        ? new Date().toISOString()
        : null
    }
  }

  // Actual database update
  const { error: toggleError } = await toggleEnding(ending.id, completed)

  if (toggleError) {
    // Revert on error
    error.value = 'Error updating ending: ' + toggleError.message
    await fetchEndings()
  }
}

// Fetch on mount and when user changes
onMounted(fetchEndings)
watch(user, fetchEndings)
</script>

<style></style>
