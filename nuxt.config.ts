import { vuetifyConfig } from './vuetify.config'

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/supabase',
    '@nuxthub/core',
    'vuetify-nuxt-module',
    '@nuxtjs/turnstile'
  ],

  runtimeConfig: {
    turnstile: {
      secretKey: process.env.TURNSTILE_SECRET_KEY,
    },
    public: {
      turnstile: {
        siteKey: process.env.TURNSTILE_SITEKEY,
      },
    },
  },

  css: ['~/assets/styles/main.scss'],

  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: vuetifyConfig,
  },

  supabase: {
    redirectOptions: {
      login: '*',
      callback: '*',
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  imports: {
    dirs: [
      'composables/auth',
      'composables/common',
      'composables/game',
    ],
  },

  app: {
    head: {
      charset: 'utf-16',
      viewport: 'width=500, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto+Mono&display=swap' },
      ],
    },
  },

  compatibilityDate: '2025-02-19',
});