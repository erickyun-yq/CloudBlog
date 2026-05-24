// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@ant-design-vue/nuxt',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  devtools: { enabled: true },
  content: {
    // https://content.nuxtjs.org/configuration
  },
  routeRules: {
    // 路由规则配置，详情见https://nuxtjs.org.cn/docs/4.x/guide/concepts/rendering#route-rules
    '/': { prerender: true },
    '/products': { swr: true },
    '/blog': { isr: true },
    '/admin/**': { ssr: false },
    '/api/**': { cors: true },
    '/old-page': { redirect: '/new-page' },
  },
  compatibilityDate: '2026-05-28',
  antd: {
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
  pinia: {
    storesDirs: [],
  },
})
