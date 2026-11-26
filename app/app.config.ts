export default defineAppConfig({
  foo: 'bar',
  ui: {
    modal: {
      slots: {
        overlay: 'backdrop-blur-xl',
        content: 'bg-(--ui-model) shadow-xl'
      },
      variants: {
        overlay: {
          true: {
            overlay: 'bg-(--ui-mask)/28'
          }
        }
      }
    }
  }
})
