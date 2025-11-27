<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'
import { SpeedInsights } from '@vercel/speed-insights/nuxt'

useSeoMeta({
  title: 'Pod Data',
  description: 'Completion checklist for NieR: Automata to track your in-game progress.',
  ogTitle: 'Pod Data',
  ogDescription: 'Completion checklist for NieR: Automata to track your in-game progress.',
  ogImage: '/img/robot-secondary.svg',
  ogType: 'website',
})
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
