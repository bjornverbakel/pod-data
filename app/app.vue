<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'
import { SpeedInsights } from '@vercel/speed-insights/nuxt'
</script>

<template>
  <v-app>
    <NuxtLayout>
      <!-- Vercel Analytics and Speed Insights -->
      <Analytics script-src="/monitor/script.js" endpoint="/monitor/vitals" />
      <SpeedInsights script-src="/monitor/speed-insights/script.js" endpoint="/monitor/speed-insights/vitals" />

      <!-- Main page -->
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>
