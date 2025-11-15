<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-6">
          <v-card-title class="text-h3 mb-4">
            Nuxt3 + Supabase
          </v-card-title>
          
          <v-card-subtitle class="text-h5 mb-2">
            Starter Template
          </v-card-subtitle>
          
          <v-card-text v-if="user" class="text-h6 mb-4">
            Hi {{ user.user_metadata.first_name }}
          </v-card-text>
          
          <v-card-text v-else class="text-body-1 mb-4">
            unauthenticated
          </v-card-text>
          
          <v-card-text class="text-body-1 mb-6">
            Authentication template with email and password, using Supabase. If you want a quick start to your next Nuxt3 app, please feel free to use this template.
          </v-card-text>
          
          <v-card-actions v-if="user">
            <v-btn
              @click="logout"
              color="primary"
              :loading="loading"
              block
            >
              Log out
            </v-btn>
          </v-card-actions>
          
          <v-card-actions v-else class="flex-column ga-3">
            <v-btn
              to="/login"
              color="primary"
              block
            >
              Login
            </v-btn>
            <v-btn
              to="/register"
              variant="outlined"
              block
            >
              Sign up
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const client = useSupabaseClient();
const user = useSupabaseUser();
const loading = ref(false);

const logout = async () => {
  loading.value = true;
  const { error } = await client.auth.signOut();
  if (error) {
    loading.value = false;
    alert('Something went wrong!');
  }
};

useHead({
  title: 'supaAuth',
  meta: [
    {
      name: 'description',
      content: 'Authentication template with email and password, using Supabase. If you want a quick start to your next Nuxt3 app, please feel free to use this template.',
    },
  ],
});
</script>
