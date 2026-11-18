<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const { locale, setLocale } = useI18n()
const localeOptions = [
  {
    label: '简体中文',
    value: 'zh',
  },
  {
    label: 'English',
    value: 'en',
  },
] as const
const items = computed<DropdownMenuItem[]>(() =>
  localeOptions.map(({ label, value }) => {
    const selected = locale.value === value

    return {
      label,
      icon: selected ? 'cuida:single-select-outline' : 'lsicon:radio-unselected-filled',
      class: selected
        ? 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300'
        : undefined,
      ui: {
        itemLabel: selected ? 'font-semibold' : '',
      },
      onSelect: () => setLocale(value),
    }
  }),
)
</script>

<template>
  <UDropdownMenu
    :modal="false"
    :items="items"
    :content="{ align: 'center', side: 'bottom', sideOffset: 8 }"
    :ui="{ content: 'w-28 min-w-0',
           item: 'items-center hover:bg-amber-300 rounded-[.4rem]',
           itemLeadingIcon: 'size-2 shrink-0 text-sky-500!',
           itemLabel: 'whitespace-nowrap text-sm leading-4 w-20 text-start',
    }"
  >
    <UButton
      class="hover:bg-sky-100 dark:hover:bg-neutral-800 active:bg-auto rounded-full ring-0 p-1.5"
      icon="hugeicons:translation"
      color="neutral"
      variant="outline"
      size="xl"
    />
  </UDropdownMenu>

  <h1>{{ $t('homePage') }}</h1>
</template>