<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useThemeStore } from '~/stores/ThemeStore'

const store = useThemeStore()
const iconAnimationActive = ref(false)
let iconAnimationTimeout: ReturnType<typeof setTimeout> | undefined

const startIconAnimation = () => {
  iconAnimationActive.value = true
  if (iconAnimationTimeout) clearTimeout(iconAnimationTimeout)
  iconAnimationTimeout = setTimeout(() => {
    iconAnimationActive.value = false
    iconAnimationTimeout = undefined
  }, 2000)
}

const toggleTheme = (event: MouseEvent) => {
  startIconAnimation()
  const button = event.currentTarget
  if (!(button instanceof HTMLElement)) {
    store.toggle()
    return
  }

  const rect = button.getBoundingClientRect()
  store.toggle({
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  })
}

onMounted(() => store.init())
onBeforeUnmount(() => {
  if (iconAnimationTimeout) clearTimeout(iconAnimationTimeout)
})
</script>

<template>
  <UButton
    aria-label="Toggle color theme"
    class="hover:bg-(--ui-nav-bg) active:bg-auto rounded-full p-1.5 ring-0"
    color="neutral"
    size="xl"
    variant="ghost"
    @click="toggleTheme"
  >
    <template #leading>
      <span
        v-auto-animate="{ duration: 600, easing: 'ease-in-out' }"
        class="inline-flex"
      >
        <UIcon
          :key="store.theme"
          :name="store.theme === 'dark'
            ? 'line-md:sunny-filled-loop-to-moon-filled-loop-transition'
            : 'line-md:moon-filled-alt-to-sunny-filled-loop-transition'"
          :class="{ 'theme-icon-switch': iconAnimationActive }"
          class="h-6 w-6"
        />
      </span>
    </template>
  </UButton>
</template>

<style scoped>
.theme-icon-switch {
  transform-origin: center;
  animation: theme-icon-switch 2s ease-in-out both;
}

@keyframes theme-icon-switch {
  0% {
    transform: rotate(80deg);
  }
  100% {
    transform: rotate(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .theme-icon-switch {
    animation-duration: .8s;
  }
}
</style>
