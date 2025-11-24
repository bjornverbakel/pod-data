<template>
  <Checklist
    title="Enemies"
    :items="enemies"
    :loading="loading"
    :error="error"
    :headers="headers"
    :is-completed="isCompleted"
    :on-toggle="handleToggle"
    group-by="type"
    :group-order="[
      'Standard Units',
      'Desert Machines',
      'Amusement Park Machines',
      'Forest Kingdom Machines',
      'Factory Machines',
      'Village Machines',
      'Enhanced Machines',
      'EMP Attack Machines',
      'Special Unit Machines',
      'Androids',
      'Amicable Machines',
      'Peculiar Machines',
    ]"
  />
</template>

<script lang="ts" setup>
useHead({
  title: 'Enemies | Pod Data',
})

import type { Header } from '~/components/Checklist.vue'

const { getAllEnemiesWithStatus, toggleEnemy } = useEnemies()

const {
  items: enemies,
  loading,
  error,
  isCompleted,
  handleToggle,
} = useChecklist(getAllEnemiesWithStatus, toggleEnemy, 'user_enemies')

const headers: Header[] = [
  { title: 'Name', key: 'name', width: '25%' },
  { title: 'Variant', key: 'variant', width: '20%' },
  { title: 'Acquisition', key: 'acquisition' },
]
</script>

<style></style>
