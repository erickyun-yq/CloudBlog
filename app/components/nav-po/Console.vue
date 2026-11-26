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
    :ui="{ overlay: 'bg-(--ui-mask)/60 backdrop-blur-xl' }"
  >
    <HTooltip
      v-slot="{ triggerProps }"
      :text="$t('console')"
    >
      <UButton
        v-bind="triggerProps"
        class="rounded-full max-w-8.5 max-h-8.5 ring-0 bg-transparent hover:bg-(--ui-nav-cpt-bg)"
        color="neutral"
        variant="subtle"
        icon="solar:widget-6-bold"
        :ui="{ leadingIcon: 'h-5.5 w-5.5' }"
      />
    </HTooltip>
    <template #content>
      <UEmpty class="h-48 m-4" />
    </template>
  </UModal>
</template>
