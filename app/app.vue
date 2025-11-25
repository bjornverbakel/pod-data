<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'
import { SpeedInsights } from '@vercel/speed-insights/nuxt'
</script>

<template>
  <v-app>
    <!-- Vercel Analytics and Speed Insights -->
    <Analytics />
    <SpeedInsights />

    <!-- Main Application Layout -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>
