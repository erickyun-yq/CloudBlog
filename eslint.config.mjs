// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // ...Custom flat configs append after nuxt's configs
).prepend(
  // ...Prepend some flat configs in front
)
// Override some rules in a specific config, based on their name
  .override('nuxt/vue/rules', {
    rules: {
      // 关闭组件命名规则
      'vue/multi-word-component-names': 'off',
    },
  })
  .override('nuxt/stylistic', {
    rules: {
      // 关闭逗号结尾规则
      '@stylistic/comma-dangle': 'off',
      // 关闭末尾换行规则
      '@stylistic/eol-last': 'off',
    },
  })
