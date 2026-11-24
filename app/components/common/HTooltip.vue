<script setup lang="ts">
defineProps<{
  text: string
}>()

const isHovered = ref(false)
const isTabFocused = ref(false)
let tabKeyPressed = false

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'Tab') {
    tabKeyPressed = true
  }
  else if (event.key !== 'Shift') {
    tabKeyPressed = false
  }
}

function onKeyUp(event: KeyboardEvent) {
  if (event.key === 'Tab') {
    tabKeyPressed = false
  }
}

function onPointerDown() {
  tabKeyPressed = false
  isTabFocused.value = false
}

function onPointerEnter(event: PointerEvent) {
  isHovered.value = event.pointerType === 'mouse'
}

function onPointerLeave() {
  isHovered.value = false
}

function onFocus() {
  if (tabKeyPressed) {
    isTabFocused.value = true
  }
  tabKeyPressed = false
}

function onBlur() {
  isTabFocused.value = false
}

function onClick() {
  isHovered.value = false
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
  document.addEventListener('keyup', onKeyUp)
  document.addEventListener('pointerdown', onPointerDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
  document.removeEventListener('keyup', onKeyUp)
  document.removeEventListener('pointerdown', onPointerDown)
})

const triggerProps = {
  onPointerenter: onPointerEnter,
  onPointerleave: onPointerLeave,
  onFocus,
  onBlur,
  onClick
}
</script>

<template>
  <UTooltip
    :text="text"
    :open="isHovered || isTabFocused"
  >
    <slot :trigger-props="triggerProps" />
  </UTooltip>
</template>
