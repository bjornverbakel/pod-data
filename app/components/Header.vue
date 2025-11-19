<template>
  <v-app-bar app color="primary" id="header">
    <template v-slot:prepend class="ga-4">
      <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title class="text-h4">
      <NuxtLink to="/" class="text-decoration-none d-inline-block" style="color: inherit">
        NACC
        <div v-if="$vuetify.display.smAndUp" class="text-body-2">
          NieR: Automata Completion Checklist
        </div>
      </NuxtLink>
    </v-app-bar-title>

    <template v-slot:append>
      <!-- Anonymous user: Show chip + Sign up button -->
      <div v-if="user && isAnonymous" class="d-flex align-center ga-2">
        <v-chip color="warning" size="small" prepend-icon="mdi-incognito"> Guest Mode </v-chip>
        <v-btn color="secondary" to="/register" prepend-icon="mdi-account-plus"> Sign up </v-btn>
        <v-btn color="secondary" @click="logout" icon="mdi-logout" :loading="loading"></v-btn>
      </div>

      <!-- Normal logged in user: Show profile -->
      <div v-else-if="user" class="d-flex align-center ga-2">
        <!-- Desktop: Show email and logout button -->
        <div v-if="$vuetify.display.mdAndUp" class="d-flex align-center ga-2">
          <span class="text-body-2"
            ><v-icon start icon="mdi-account" />{{ profile?.username || user.email }}</span
          >
          <v-btn color="secondary" @click="logout" icon="mdi-logout" :loading="loading"></v-btn>
        </div>

        <!-- Mobile: Show menu -->
        <v-menu v-else>
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-account-circle" v-bind="props"></v-btn>
          </template>
          <v-list style="max-width: 400px">
            <v-list-item prepend-icon="mdi-account" title="Logged in as">
              <v-list-item-subtitle class="text-body-1">{{
                profile?.username || user.email
              }}</v-list-item-subtitle>
            </v-list-item>
            <v-divider class="my-2" />
            <v-list-item @click="logout">
              <v-list-item-title>
                <v-icon start>mdi-logout</v-icon>
                Logout
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <!-- No user at all: Show login button -->
      <div v-else>
        <v-btn color="secondary" to="/login" prepend-icon="mdi-login">Log in</v-btn>
      </div>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const { profile } = useProfile()
const { isAnonymous } = useAuth()
const client = useSupabaseClient()
const loading = ref(false)

// Access drawer from layout
const drawer = inject<Ref<boolean>>('drawer')

const toggleDrawer = () => {
  if (drawer) {
    drawer.value = !drawer.value
  }
}

const logout = async () => {
  loading.value = true
  const { error } = await client.auth.signOut()
  loading.value = false
  if (error) {
    alert('Something went wrong!')
  }
}
</script>

<style scoped lang="scss">
#header {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}
</style>
