<template>
  <v-app>
    <v-app-bar color="primary">
      <template v-slot:prepend class="ga-4">
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title class="text-h4">
        NACC
        <div v-if="$vuetify.display.smAndUp" class="text-caption">
          NieR: Automata Completion Checklist
        </div>
      </v-app-bar-title>

      <template v-slot:append>
        <v-btn prepend-icon="mdi-login">Log in</v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <v-container fluid class="fill-height d-flex align-center justify-center">
        <slot></slot>
      </v-container>
    </v-main>
  </v-app>
</template>
