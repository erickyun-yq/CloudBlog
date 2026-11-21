// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@formkit/auto-animate/nuxt',
    '@nuxt/ui', '@nuxt/content',
    '@nuxt/icon', '@nuxt/fonts',
    '@nuxt/image', '@nuxt/eslint',
    '@tresjs/nuxt', '@pinia/nuxt',
    '@nuxtjs/i18n',
  ],

  devtools: { enabled: true },
  css: ['~/assets/main.css'],

  content: {
    // https://content.nuxtjs.org/configuration
  },
  ui: {
    colorMode: false
  },

  routeRules: {
    // 路由规则配置，详情见https://nuxtjs.org.cn/docs/4.x/guide/concepts/rendering#route-rules
    '/': { prerender: true },
    '/products': { swr: true },
    '/blog': { isr: true },
    '/admin/**': { ssr: false },
    '/api/**': { cors: true },
    '/old-page': { redirect: '/new-page' }
  },
  compatibilityDate: '2026-05-28',

  vite: {
    optimizeDeps: {
      include: [
        '@tiptap/extension-text-align',
        'three',
      ]
    }
  },

  eslint: {
    checker: {
      eslintPath: 'eslint',
    },
    config: {
      stylistic: true,
    },
  },

  fonts: {
    provider: 'local',
    families: [
      { name: 'Alimama DongFangDaKai', global: true, provider: 'local', src: '/fonts/AlimamaDongFangDaKai-Regular.ttf' },
      { name: 'Alimama AgileVF', global: true, provider: 'local', src: '/fonts/AlimamaAgileVF-Thin.ttf' },
    ],
  },

  i18n: {
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: false,
    },
    locales: [
      { code: 'zh', language: 'zh-CN', name: '简体中文', file: 'zh.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' }
    ],
    defaultLocale: 'zh',
  },

  pinia: {
    storesDirs: ['./stores/**'],
  },
})
