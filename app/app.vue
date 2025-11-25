<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'
import { SpeedInsights } from '@vercel/speed-insights/nuxt'

useHead({
  script: [
    {
      src: "/my-analytics/script.js",
      async: true,
      "data-endpoint": "/my-analytics"
    }
  ]
});
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
