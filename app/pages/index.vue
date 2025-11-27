<template>
  <section class="section-spacing">
    <div>
      <h1 class="main-header">Pod Data</h1>
      <h2 class="sub-header mt-1">Unofficial completion checklist for NieR: Automata</h2>
    </div>

    <p>
      This website is an unofficial checklist for tracking your completion progress in
      <em>NieR: Automata</em>. It allows you to mark various items, quests, and achievements as
      completed, helping you keep track of what you've done and what still needs to be accomplished.
    </p>

    <v-btn class="w-fit" variant="flat" to="/about">Read More</v-btn>
  </section>

  <section class="section-spacing">
    <h1 class="main-header">Overall Progress</h1>

    <AppAlert v-if="error" type="error" :message="error" :closable="false" @clear="error = ''" />

    <div class="dashboard-grid">
      <v-skeleton-loader v-if="loading" v-for="n in 9" type="article" height="156" />

      <v-card v-else v-for="category in categoryStats" :key="category.key" :to="`/${category.key}`">
        <div class="pa-4 pb-2">
          <v-icon size="32">{{ category.icon }}</v-icon>
        </div>
        <v-card-title class="d-flex align-center justify-space-between ga-2">
          <span class="text-truncate">{{ category.name }}</span>
          <v-chip size="small" variant="flat" class="min-w-min">
            {{ category.completed }} / {{ category.total }}
          </v-chip>
        </v-card-title>

        <v-card-text>
          <v-progress-linear
            :model-value="category.progress"
            :color="category.progress === 100 ? 'success' : 'primary'"
            height="8"
          />
          <div class="text-caption mt-2">{{ Math.round(category.progress) }}% Complete</div>
        </v-card-text>
      </v-card>
    </div>
  </section>
</template>

<script setup lang="ts">
useHead({
  // Will be auto added by Nuxt SEO
  title: '',
})

// defineOgImageComponent('Nuxt', {
//   title: 'Nuxt Commerce',
//   description: 'A high-performance, server-rendered E-commerce app built with Nuxt & Shopify',
//   theme: '#4ADE80',
//   headline: '',
//   colorMode: 'dark',
// })

const loading = ref(true)
const error = ref('')
const categoryStats = ref<any[]>([])

const fetchAllStats = async () => {
  error.value = ''

  try {
    const stats = await Promise.all(
      categories.map(async category => {
        const composableInstance = category.composable()
        const fetchFunction = composableInstance[
          category.fetchFunction as keyof typeof composableInstance
        ] as () => Promise<{ data: any; error: any }>
        const { data, error: fetchError } = await fetchFunction()

        if (fetchError) {
          throw new Error(`Failed to fetch ${category.name}: ${fetchError.message}`)
        }

        const total = data?.length || 0
        const completed =
          data?.filter((item: any) => {
            const relation = item[category.relationKey]
            return relation && relation.length > 0 && relation[0]?.completed
          }).length || 0

        const progress = total > 0 ? (completed / total) * 100 : 0

        return {
          ...category,
          total,
          completed,
          progress,
        }
      })
    )

    categoryStats.value = stats
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchAllStats)

// Watch for user changes to refetch data
const user = useSupabaseUser()
watch(user, fetchAllStats)
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  /* Default: 1 column for smallest screens (or without media query support) */
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}

/* --- */

/* Medium screens (e.g., tablets) - Transition to 2 columns */
@media (min-width: 600px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* --- */

/* Large screens (e.g., desktops) - Transition to 3 columns */
@media (min-width: 900px) {
  .dashboard-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
