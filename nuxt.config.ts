import { vuetifyConfig } from './vuetify.config'

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/supabase',
    'vuetify-nuxt-module',
    '@nuxtjs/turnstile',
    '@nuxtjs/seo',
    'nuxt-og-image', // Should be added by nuxt-seo, but its causing errors if not added separately
    '@nuxt/fonts',
  ],

  sitemap: {
    zeroRuntime: true,
  },

  routeRules: {
    '/': { swr: true },
    '/about': { prerender: true },
    '/disclaimer': { prerender: true },
  },

  ogImage: {
    enabled: true,
  },

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
    types: '~/types/database.types.ts',
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
      ],
    },
  },

  compatibilityDate: '2025-02-19',

  nitro: {
    preset: 'vercel',
    future: {
      nativeSWR: true,
    },
  },
})
