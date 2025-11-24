<template>
  <v-navigation-drawer v-model="drawer" class="border-0" id="navDrawer" app>
    <v-list density="compact" nav class="d-flex flex-column overflow-y-auto">
      <v-list-item prepend-icon="mdi-home" title="Home" to="/" />
      <v-list-subheader>General</v-list-subheader>
      <v-list-item
        v-for="category in generalCategories"
        :key="category.key"
        :prepend-icon="category.icon"
        :title="category.name"
        :to="`/${category.key}`"
      />
      <v-list-subheader>Equipment</v-list-subheader>
      <v-list-item
        v-for="category in equipmentCategories"
        :key="category.key"
        :prepend-icon="category.icon"
        :title="category.name"
        :to="`/${category.key}`"
      />
      <v-list-subheader>Intel</v-list-subheader>
      <v-list-item
        v-for="category in intelCategories"
        :key="category.key"
        :prepend-icon="category.icon"
        :title="category.name"
        :to="`/${category.key}`"
      />
    </v-list>

    <div class="d-flex align-center flex-column pa-4 ga-4 mt-auto">
      <v-btn
        icon="mdi-github"
        href="https://github.com/bjornverbakel/pod-data"
        target="_blank"
        variant="plain"
      >
        <v-icon size="40" icon="mdi-github" />
      </v-btn>
      <v-divider class="w-100" />
      <p class="text-caption text-medium-emphasis">
        Pod Data is an unofficial checklist for tracking your completion progress in
        <em>NieR: Automata</em>.
      </p>
      <div class="d-flex ga-2 justify-space-around text-body-2 w-100">
        <v-btn
          variant="text"
          density="compact"
          class="text-medium-emphasis text-decoration-none"
          to="about"
        >
          About
        </v-btn>
        <v-btn
          variant="plain"
          density="compact"
          class="text-medium-emphasis text-decoration-none"
          to="disclaimer"
        >
          Disclaimer
        </v-btn>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
// Access drawer state from layout
const drawer = inject<Ref<boolean>>('drawer')

// Group categories by section
const generalCategories = categories.filter(cat =>
  ['endings', 'sidequests', 'achievements'].includes(cat.key)
)

const equipmentCategories = categories.filter(cat => ['weapons', 'pod-programs'].includes(cat.key))

const intelCategories = categories.filter(cat =>
  ['archives', 'novels', 'enemies', 'fish'].includes(cat.key)
)
</script>

<style scoped lang="scss">
#navDrawer {
  :deep(.v-list-item-title) {
    text-transform: uppercase;
  }

  :deep(.v-navigation-drawer__content) {
    display: flex;
    flex-direction: column;
  }
}
</style>
