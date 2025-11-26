<template>
  <Header />
  <NavDrawer />

  <v-main>
    <v-container
      fluid
      class="main-content h-screen-content py-8 pa-sm-8 pa-md-16 d-flex flex-column ga-12 ga-md-16"
    >
      <slot />
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
const drawer = ref(false)

provide('drawer', drawer)
</script>

<style scoped lang="scss">
.main-content {
  margin: 0 auto;
  max-width: 1200px;
}
</style>
