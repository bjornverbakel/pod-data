<template>
  <Header />
  <NavDrawer />

  <v-main>
    <v-container fluid class="d-flex flex-column ga-12 ga-md-16 pa-0">
      <slot />
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
const drawer = ref(false)

provide('drawer', drawer)
</script>

<style scoped lang="scss">
@use '@/assets/styles/_mixins.scss' as *;

.main-content-wrapper {
  margin: 0 auto;
  max-width: 1200px;
  @include page-padding;
  @include h-screen-content;
}
</style>
