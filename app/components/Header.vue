<template>
  <v-app-bar app color="primary" id="header">
    <template v-slot:prepend class="ga-4">
      <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title class="app-logo text-h5">
      <NuxtLink to="/" class="text-decoration-none d-flex ga-2" style="color: inherit">
        <img src="/img/robot-secondary.svg" width="26" alt="Logo icon" />
        <span class="mt-1">Pod Data</span>
      </NuxtLink>
    </v-app-bar-title>

    <template v-slot:append>
      <!-- Anonymous user: Show chip + Sign up button -->
      <div v-if="isAnonymous" class="d-flex align-center ga-4 mr-2">
        <v-chip color="warning" size="small" prepend-icon="mdi-incognito"> Guest </v-chip>
        <v-btn
          v-if="$vuetify.display.mdAndUp"
          color="secondary"
          to="/register"
          prepend-icon="mdi-account-plus"
        >
          Sign up
        </v-btn>
      </div>

      <!-- Normal logged in user: Show action menu -->
      <div v-if="user">
        <div v-if="mdAndUp" class="d-flex align-center ga-2">
          <v-btn to="/settings" icon="mdi-cog" variant="text" />

          <v-btn
            v-if="!isAnonymous"
            icon="mdi-account"
            id="user-menu-trigger"
            variant="text"
          ></v-btn>
        </div>

        <v-btn v-else icon="mdi-dots-vertical" id="user-menu-trigger" variant="text" />

        <!-- Desktop Menu -->
        <v-menu
          v-model="menu"
          activator="#user-menu-trigger"
          v-if="mdAndUp"
          :close-on-content-click="false"
        >
          <v-list width="250" class="pt-0">
            <v-list-item v-if="isAnonymous" class="py-4">
              <template v-slot:prepend>
                <v-avatar color="primary" icon="mdi-incognito"></v-avatar>
              </template>
              <v-list-item-title v-if="isAnonymous" class="text-h6"> Guest User </v-list-item-title>
              <v-list-item-subtitle>Logged in</v-list-item-subtitle>
            </v-list-item>
            <v-list-item v-else class="py-4">
              <template v-slot:prepend>
                <v-avatar color="primary" icon="mdi-account"></v-avatar>
              </template>
              <v-list-item-title class="text-h6">
                {{ profile?.username || user.email }}
              </v-list-item-title>
              <v-list-item-subtitle>Logged in</v-list-item-subtitle>
            </v-list-item>

            <v-divider class="my-2"></v-divider>

            <v-list-item
              v-if="isAnonymous"
              to="/register"
              @click="menu = false"
              prepend-icon="mdi-account-plus"
              title="Sign up"
              :loading="loading"
            />
            <v-list-item
              v-else-if="user"
              @click="(logout(), (menu = false))"
              prepend-icon="mdi-logout"
              title="Logout"
              :loading="loading"
            />
            <DevOnly v-if="isAnonymous">
              <v-list-item
                @click="(logout(), (menu = false))"
                prepend-icon="mdi-logout"
                title="Logout"
                :loading="loading"
              />
            </DevOnly>
          </v-list>
        </v-menu>

        <!-- Mobile Bottom Sheet -->
        <v-bottom-sheet v-model="menu" activator="#user-menu-trigger" v-else>
          <v-card>
            <v-list class="pa-0">
              <v-list-item v-if="isAnonymous" class="py-4">
                <template v-slot:prepend>
                  <v-avatar color="primary" icon="mdi-incognito"></v-avatar>
                </template>
                <v-list-item-title v-if="isAnonymous" class="text-h6">
                  Guest User
                </v-list-item-title>
                <v-list-item-subtitle>Logged in</v-list-item-subtitle>
              </v-list-item>
              <v-list-item v-else class="py-4">
                <template v-slot:prepend>
                  <v-avatar color="primary" icon="mdi-account"></v-avatar>
                </template>
                <v-list-item-title class="text-h6">
                  {{ profile?.username || user.email }}
                </v-list-item-title>
                <v-list-item-subtitle>Logged in</v-list-item-subtitle>
              </v-list-item>

              <v-divider class="mb-2"></v-divider>

              <v-list-item
                to="/settings"
                prepend-icon="mdi-cog"
                title="Settings"
                @click="menu = false"
              ></v-list-item>
              <v-list-item
                v-if="isAnonymous"
                to="/register"
                prepend-icon="mdi-account-plus"
                title="Sign up"
                :loading="loading"
                @click="menu = false"
              />
              <v-list-item
                v-else-if="user"
                @click="(logout(), (menu = false))"
                prepend-icon="mdi-logout"
                title="Logout"
                :loading="loading"
              />
              <DevOnly v-if="isAnonymous">
                <v-list-item
                  @click="(logout(), (menu = false))"
                  prepend-icon="mdi-logout"
                  title="Logout"
                  :loading="loading"
                />
              </DevOnly>
            </v-list>
          </v-card>
        </v-bottom-sheet>
      </div>

      <!-- No user at all: Show login button -->
      <div v-else>
        <v-btn color="secondary" to="/login" prepend-icon="mdi-login">Log in</v-btn>
      </div>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
const { mdAndUp } = useDisplay()
const user = useSupabaseUser()
const { profile } = useProfile()
const { isAnonymous } = useAuth()
const client = useSupabaseClient()
const loading = ref(false)
const menu = ref(false)

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
  navigateTo('/')
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

@media (max-width: 400px) {
  .app-logo {
    display: none;
  }
}

@media (max-width: 200px) {
}
</style>
