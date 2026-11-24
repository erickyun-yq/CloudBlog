<script setup lang="ts">
import HTooltip from '~/components/common/HTooltip.vue'

const open = ref(false)

defineShortcuts({
  o: () => open.value = !open.value
})
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      overlay: 'bg-(--ui-mask)/88 backdrop-blur-xl',
      content: 'rounded-full'
    }"
  >
    <HTooltip
      v-slot="{ triggerProps }"
      :text="$t('signIn')"
    >
      <UButton
        v-bind="triggerProps"
        class="flex justify-center items-center rounded-md min-w-11 max-h-7 ring-0 max-md:bg-transparent max-md:min-w-6"
        :class="'bg-(--ui-nav-cpt-bg) hover:text-highlighted max-md:hover:bg-transparent'"
        color="neutral"
        variant="subtle"
        icon="fa7-solid:sign-in-alt"
        :ui="{ leadingIcon: 'h-5.5 w-5.5 max-md:h-7 max-md:w-7' }"
      />
    </HTooltip>
    <template #content>
      <Placeholder class="min-w-xs h-dvh sm:h-120 sm:w-lg rounded-full" />
    </template>
  </UModal>
</template>l