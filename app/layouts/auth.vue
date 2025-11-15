<template>
  <v-main>
    <v-container fluid class="fill-height d-flex align-center justify-center">
      <v-card max-width="500" width="100%" class="pa-4">
        <AppBackToLogin />
        <slot />
        <v-card-text class="text-caption text-center mt-4">
          This site is authenticated by supabase.com and the Supabase
          <a target="_blank" href="https://supabase.com/privacy" rel="noreferrer">Privacy Policy</a>
          and
          <a target="_blank" href="https://supabase.com/terms" rel="noreferrer">Terms of Service</a>
          apply.
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>
</template>
