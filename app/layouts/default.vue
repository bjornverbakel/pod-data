<template>
  <Header />
  <NavDrawer />

  <v-main>
    <v-container fluid :class="containerClass">
      <slot />
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
const drawer = ref(false)

provide('drawer', drawer)

const route = useRoute()
const isAuthLayout = computed(() => !!route.meta?.authLayout)

const containerClass = computed(() => {
  const base = ['d-flex', 'flex-column', 'ga-12', 'ga-md-16']
  if (isAuthLayout.value) {
    base.push('pa-0')
  } else {
    base.unshift('main-content-wrapper')
  }
  return base
})
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
