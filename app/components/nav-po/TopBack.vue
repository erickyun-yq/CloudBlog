<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  showTop: boolean
  container?: string
  threshold?: number
}>(), {
  container: '',
  threshold: 1
})

const percentScroll = ref(0)
const isVisible = ref(false)
const isAtNinetyPercent = ref(false)

let scrollContainer: Window | HTMLElement | null = null
let ticking = false

const updateScrollState = () => {
  if (!scrollContainer) return
  let scrollTop = 0
  let scrollHeight = 0
  let clientHeight = 0

  if (scrollContainer === window) {
    scrollTop = window.scrollY || document.documentElement.scrollTop
    scrollHeight = document.documentElement.scrollHeight
    clientHeight = window.innerHeight
  }
  else {
    const el = scrollContainer as HTMLElement
    scrollTop = el.scrollTop
    scrollHeight = el.scrollHeight
    clientHeight = el.clientHeight
  }

  const maxScroll = scrollHeight - clientHeight
  const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0
  percentScroll.value = Math.round(percent)
  isAtNinetyPercent.value = percent >= 90
  isVisible.value = scrollTop > props.threshold

  ticking = false
}

const handleScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollState)
    ticking = true
  }
}

const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
  if (scrollContainer === window) {
    window.scrollTo({ top: 0, behavior })
  }
  else if (scrollContainer) {
    (scrollContainer as HTMLElement).scrollTo({ top: 0, behavior })
  }
}

onMounted(() => {
  if (props.container) {
    scrollContainer = document.querySelector<HTMLElement>(props.container)
  }
  if (!scrollContainer) {
    scrollContainer = window
  }

  scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
  updateScrollState()
})

onUnmounted(() => {
  if (scrollContainer) {
    scrollContainer.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <UButton
    v-if="isVisible"
    class="group bg-(--ui-nav-bg)/70 backdrop-blur-md inset-shadow-sm rounded-full h-9! min-w-9 px-0! py-0! transition-[width,translate] duration-1000 ease-out"
    :class="showTop || !isAtNinetyPercent
      ? 'w-9 justify-center'
      : 'w-22 justify-center -translate-x-13'"
    @click="scrollToTop()"
  >
    <UIcon
      v-if="showTop"
      name="boxicons:arrow-to-top-stroke-filled"
      class="-mb-0.75 size-6 shrink-0"
      aria-hidden="true"
    />
    <span
      v-else
      class="grid w-full min-w-0 grid-cols-[minmax(0,1fr)] place-items-center overflow-hidden"
    >
      <span class="col-start-1 text-default -mb-0.75 row-start-1 min-w-0 max-w-full overflow-hidden whitespace-nowrap text-center leading-none transition-opacity duration-300 ease-in-out group-hover:opacity-0">
        {{ isAtNinetyPercent ? $t('backTop') : `${percentScroll}` }}
      </span>
      <UIcon
        name="boxicons:arrow-to-top-stroke-filled"
        class="-mb-0.75 col-start-1 row-start-1 size-6 shrink-0 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
        aria-hidden="true"
      />
    </span>
  </UButton>
</template>
