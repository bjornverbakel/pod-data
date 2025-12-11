import { vuetifyConfig } from './vuetify.config'

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/supabase',
    'vuetify-nuxt-module',
    '@nuxtjs/turnstile',
    'nuxt-og-image',
    '@nuxtjs/seo',
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
      login: '/login',
      callback: '/confirm',
      include: ['/settings', '/new-password'],
    },
  },

  components: [
    {
      path: '~/components/',
      pathPrefix: false,
    },
  ],

  future: {
    compatibilityVersion: 4,
  },

  imports: {
    dirs: ['composables/**'],
  },

  experimental: {
    checkOutdatedBuildInterval: 5 * 60 * 1000, // 5 minutes
  },

  site: {
    url: 'https://poddata.net',
    name: 'Pod Data',
  },

  app: {
    head: {
      charset: 'utf-16',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
      htmlAttrs: {
        lang: 'en',
      },
      bodyAttrs: {
        class: 'font-base',
      },

      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/img/robot-primary.svg',
          media: '(prefers-color-scheme: light)',
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/img/robot-secondary.svg',
          media: '(prefers-color-scheme: dark)',
        },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto+Mono&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap',
        },
      ],
    },
  },

  compatibilityDate: '2025-02-19',

  nitro: {
    preset: 'vercel',
  },
})
