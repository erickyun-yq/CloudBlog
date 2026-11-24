<script setup lang="ts">
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
    <UTooltip :text="$t('signIn')">
      <UButton
        class="flex justify-center items-center rounded-md min-w-11 max-h-7 ring-0 max-md:bg-transparent max-md:min-w-6"
        :class="'bg-(--ui-nav-cpt-bg) hover:text-highlighted max-md:hover:bg-transparent'"
        color="neutral"
        variant="subtle"
        icon="fa7-solid:sign-in-alt"
        :ui="{ leadingIcon: 'h-5.5 w-5.5 max-md:h-7 max-md:w-7' }"
      />
    </UTooltip>
    <template #content>
      <Placeholder class="h-48 m-4" />
    </template>
  </UModal>
</template>l