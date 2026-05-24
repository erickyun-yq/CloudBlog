// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  routeRules: {
    //路由规则配置，详情见https://nuxtjs.org.cn/docs/4.x/guide/concepts/rendering#route-rules
    '/': { prerender: true },
    '/products': { swr: true },
    '/blog': { isr: true },
    '/admin/**': { ssr: false },
    '/api/**': { cors: true },
    '/old-page': { redirect: '/new-page' }, 
  },   
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@ant-design-vue/nuxt',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  content: {

  },
  eslint: {
    checker: true,
    config: {
      stylistic: true,
    }
  },                 
  fonts: {
    families: [
      { name: 'Alimama DongFangDaKai', global: true, provider: 'local', src: '/fonts/AlimamaDongFangDaKai-Regular.ttf' },
      { name: 'Alimama AgileVF', global: true, provider: 'local', src: '/fonts/AlimamaAgileVF-Thin.ttf' },
    ],
  },
  antd: {
  },
  pinia: {
    storesDirs: []
  },
  devtools: { enabled: true },
  compatibilityDate: '2026-05-28',
})