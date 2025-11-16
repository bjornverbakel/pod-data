<template>
  <Header />
  <NavDrawer />

  <v-main>
    <v-container fluid class="main-content py-8 pa-sm-8 pa-md-16 d-flex flex-column ga-8 ga-md-12">
      <slot />
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
const drawer = ref(true)

// Make drawer accessible globally via provide/inject
provide('drawer', drawer)
</script>

<style scoped lang="scss">
.main-content {
  margin: 0 auto;
  max-width: 1200px;
  min-height: calc(100vh - 64px); // Adjust for app-bar height
}
</style>
