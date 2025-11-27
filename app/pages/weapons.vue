<template>
  <Checklist
    title="Weapons"
    :items="weapons"
    :loading="loading"
    v-model:feedback="feedback"
    :headers="headers"
    :is-completed="isCompleted"
    :on-toggle="handleToggle"
    group-by="type"
    :group-order="['Small Swords', 'Large Swords', 'Spears', 'Combat Bracers']"
  />
</template>

<script lang="ts" setup>
useHead({
  title: 'Weapons',
})

import type { Header } from '~/components/Checklist.vue'

const { getAllWeaponsWithStatus, toggleWeapon } = useWeapons()

const {
  items: weapons,
  loading,
  feedback,
  isCompleted,
  handleToggle,
} = useChecklist(getAllWeaponsWithStatus, toggleWeapon, 'user_weapons')

const headers: Header[] = [
  { title: 'Name', key: 'name', width: '15%' },
  { title: 'Acquisition', key: 'acquisition' },
]
</script>

<style></style>
