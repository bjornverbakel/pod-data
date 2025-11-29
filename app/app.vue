<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'
import { SpeedInsights } from '@vercel/speed-insights/nuxt'

useSeoMeta({
  title: 'Pod Data',
  description:
    "Pod Data is an unofficial checklist for tracking your completion progress in NieR: Automata. Mark various items, quests, and achievements as completed, to help keep track of what you've done and what still needs to be accomplished.",
  ogTitle: 'Pod Data',
  ogDescription:
    "Pod Data is an unofficial checklist for tracking your completion progress in NieR: Automata. Mark various items, quests, and achievements as completed, to help keep track of what you've done and what still needs to be accomplished.",
  ogType: 'website',
})

defineOgImageComponent('PodData')
</script>

<template>
  <v-app>
    <NuxtLayout>
      <!-- Vercel Analytics and Speed Insights -->
      <Analytics />
      <SpeedInsights />

      <!-- Main page -->
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>
