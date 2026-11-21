<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const topEnt = withDefaults(defineProps<{
  showTop: boolean
  container?: string
  threshold?: number
  buttonStyle?: string
}>(), {
  container: '',
  threshold: 1,
  buttonStyle: 'bg-(--ui-nav-cpt-bg)/70 hover:bg-(--ui-top-back) active:bg-(--ui-top-back)'
})

const percentScroll = ref(0)
const isVisible = ref(false)
const isAtNinetyPercent = ref(false)

let scrollContainer: Window | HTMLElement | null = null
let ticking = false
let scrollAnimationFrame: number | null = null
let hideTimeout: number | null = null

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
  if (scrollTop > topEnt.threshold) {
    if (hideTimeout !== null) {
      window.clearTimeout(hideTimeout)
      hideTimeout = null
    }
    isVisible.value = true
  }
  else if (isVisible.value && hideTimeout === null) {
    hideTimeout = window.setTimeout(() => {
      isVisible.value = false
      hideTimeout = null
    }, 500)
  }

  ticking = false
}

const handleScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollState)
    ticking = true
  }
}

const scrollToTop = () => {
  const target = scrollContainer
  if (!target) return

  if (scrollAnimationFrame !== null) {
    window.cancelAnimationFrame(scrollAnimationFrame)
  }

  const startScrollTop = target === window
    ? window.scrollY || document.documentElement.scrollTop
    : (target as HTMLElement).scrollTop
  const duration = 1500
  let startTime: number | null = null

  const animate = (timestamp: number) => {
    if (startTime === null) startTime = timestamp

    const progress = Math.min((timestamp - startTime) / duration, 1)
    const easedProgress = progress < 0.5
      ? 4 * progress ** 3
      : 1 - ((-2 * progress + 2) ** 3) / 2
    const scrollTop = startScrollTop * (1 - easedProgress)

    if (target === window) {
      window.scrollTo(0, scrollTop)
    }
    else {
      (target as HTMLElement).scrollTop = scrollTop
    }

    if (progress < 1) {
      scrollAnimationFrame = window.requestAnimationFrame(animate)
    }
    else {
      scrollAnimationFrame = null
    }
  }

  scrollAnimationFrame = window.requestAnimationFrame(animate)
}

onMounted(() => {
  if (topEnt.container) {
    scrollContainer = document.querySelector<HTMLElement>(topEnt.container)
  }
  if (!scrollContainer) {
    scrollContainer = window
  }

  scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
  updateScrollState()
})

onUnmounted(() => {
  if (hideTimeout !== null) {
    window.clearTimeout(hideTimeout)
  }
  if (scrollAnimationFrame !== null) {
    window.cancelAnimationFrame(scrollAnimationFrame)
  }
  if (scrollContainer) {
    scrollContainer.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <UButton
    v-if="isVisible"
    class="group backdrop-blur-md inset-shadow-sm rounded-full h-8.5! min-w-8.5 px-0! py-0! transition-[width,translate] duration-1000 ease-out"
    :class="showTop || !isAtNinetyPercent
      ? 'w-8.5 justify-center ' + topEnt.buttonStyle
      : 'w-22 justify-center -translate-x-13 ' + topEnt.buttonStyle"
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
        class="-mb-0.75 col-start-1 row-start-1 size-5.5 shrink-0 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
        aria-hidden="true"
      />
    </span>
  </UButton>
</template>
