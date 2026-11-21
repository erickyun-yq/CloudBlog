<script setup lang="ts">
import { computed, onMounted, ref, useId, defineProps } from 'vue'
import { useThemeStore } from '~/stores/ThemeStore'

const styleEnt = withDefaults(defineProps<{
  buttonStyle?: string
}>(), {
  buttonStyle: 'hover:bg-(--ui-nav-cpt-bg)'
})

const store = useThemeStore()
const darkRotationActive = ref(false)
const moonMaskId = `color-mode-moon-${useId()}`

const iconTransitionDuration = computed(() => {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 1
  }
  return darkRotationActive.value ? 1200 : 1000
})

const toggleTheme = (event: MouseEvent) => {
  darkRotationActive.value = store.theme === 'light'
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
</script>

<template>
  <UTooltip :text="$t('theme')">
    <UButton
      aria-label="Toggle color theme"
      class="active:bg-auto rounded-full p-1.5 ring-0"
      :class="styleEnt.buttonStyle"
      color="neutral"
      size="xl"
      variant="ghost"
      @click="toggleTheme"
    >
      <template #leading>
        <span class="inline-flex">
          <Transition
            mode="out-in"
            :duration="{ enter: iconTransitionDuration, leave: 0 }"
            :enter-active-class="darkRotationActive ? 'dark-icon-enter-active' : 'moon-icon-enter-active'"
          >
            <svg
              v-if="store.theme === 'light'"
              key="light"
              viewBox="0 0 22 22"
              class="h-5.5 w-5.5"
              aria-hidden="true"
            >
              <defs>
                <mask
                  :id="moonMaskId"
                  maskUnits="userSpaceOnUse"
                >
                  <rect
                    width="22"
                    height="22"
                    fill="white"
                  />
                  <circle
                    class="moon-cutout"
                    cx="18"
                    cy="7"
                    r="8"
                    fill="black"
                  />
                </mask>
              </defs>
              <circle
                cx="12"
                cy="12"
                r="9"
                fill="currentColor"
                :mask="`url(#${moonMaskId})`"
              />
            </svg>
            <UIcon
              v-else
              key="dark"
              name="line-md:moon-filled-to-sunny-filled-transition"
              class="h-5.5 w-5.5"
            />
          </Transition>
        </span>
      </template>
    </UButton>
  </UTooltip>
</template>

<style scoped>
.dark-icon-enter-active {
  transform-box: fill-box;
  transform-origin: center;
  animation: dark-icon-rotate-return 1.4s ease-in-out both;
}

.moon-icon-enter-active .moon-cutout {
  transform-box: fill-box;
  transform-origin: center;
  animation: moon-cutout-roll 1s ease-in-out both;
}

@keyframes dark-icon-rotate-return {
  0% {
    transform: rotate(0deg);
  }
  60% {
    transform: rotate(-80deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

@keyframes moon-cutout-roll {
  from {
    transform: translate(12px, 10px) scale(0.82);
  }
  to {
    transform: translate(0, 0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .dark-icon-enter-active,
  .moon-icon-enter-active .moon-cutout {
    animation-duration: 0.01ms;
  }
}
</style>
