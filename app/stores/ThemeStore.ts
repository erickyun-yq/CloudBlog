import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: 'light',
    expire: Date.now() + 3 * 24 * 60 * 60 * 1000,
  }),
  actions: {
    init() {
      if (typeof window === 'undefined') return
      const lsg = localStorage.getItem('blog-theme')
      if (lsg) {
        const savedTheme = JSON.parse(lsg)
        if (savedTheme.expire < Date.now()) {
          localStorage.removeItem('blog-theme')
          this.systemInit()
          return
        }
        this.theme = savedTheme.theme
        this.expire = savedTheme.expire
        this.set()
        return
      }

      this.systemInit()
    },

    systemInit() {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      this.expire = Date.now() + 3 * 24 * 60 * 60 * 1000
      this.theme = mq.matches ? 'dark' : 'light'
      this.set()
    },

    toggle(origin?: { x: number, y: number }) {
      const nextTheme = this.theme === 'light' ? 'dark' : 'light'
      const applyTheme = () => {
        this.theme = nextTheme
        this.set()
      }

      if (typeof window === 'undefined') {
        applyTheme()
        return
      }

      const transitionDocument = document as Document & {
        startViewTransition?: (callback: () => void) => { finished: Promise<void> }
      }

      if (
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
        || !transitionDocument.startViewTransition
      ) {
        applyTheme()
        return
      }

      const root = document.documentElement
      const duration = '1600ms cubic-bezier(0.2, 0.8, 0.2, 1) both'
      root.style.setProperty('--theme-transition-x', `${origin?.x ?? window.innerWidth / 2}px`)
      root.style.setProperty('--theme-transition-y', `${origin?.y ?? window.innerHeight / 2}px`)
      root.style.setProperty(
        '--theme-transition-old-animation',
        nextTheme === 'dark' ? `theme-contract ${duration}` : 'none',
      )
      root.style.setProperty(
        '--theme-transition-new-animation',
        nextTheme === 'light' ? `theme-reveal ${duration}` : 'none',
      )
      root.style.setProperty('--theme-transition-old-z', nextTheme === 'dark' ? '2' : '1')
      root.style.setProperty('--theme-transition-new-z', nextTheme === 'dark' ? '1' : '2')

      const transition = transitionDocument.startViewTransition(applyTheme)
      const clearTransitionStyles = () => {
        root.style.removeProperty('--theme-transition-x')
        root.style.removeProperty('--theme-transition-y')
        root.style.removeProperty('--theme-transition-old-animation')
        root.style.removeProperty('--theme-transition-new-animation')
        root.style.removeProperty('--theme-transition-old-z')
        root.style.removeProperty('--theme-transition-new-z')
      }
      void transition.finished.then(clearTransitionStyles, clearTransitionStyles)
    },

    set() {
      if (typeof window === 'undefined') return
      document.documentElement.classList.toggle('dark', this.theme === 'dark')
      localStorage.setItem('blog-theme', JSON.stringify({
        theme: this.theme,
        expire: this.expire,
      }))
    },
  },
})
