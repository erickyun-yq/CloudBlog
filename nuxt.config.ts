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
  compatibilityDate: '2024-04-03',
})