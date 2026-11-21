<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { defineProps } from 'vue'

const { locale, setLocale } = useI18n()
const styleEnt = withDefaults(defineProps<{
  itemStyle?: string
  selectStyle?: string
  buttonStyle?: string
}>(), {
  itemStyle: 'hover:bg-(--ui-nav-fyi-bg)',
  selectStyle: 'bg-(--ui-nav-fyi-bg)',
  buttonStyle: 'hover:bg-(--ui-nav-cpt-bg)'
})

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
      class: selected ? styleEnt.selectStyle : undefined,
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
           item: 'items-center rounded-[.4rem] mb-0.5 mt-0.2 ' + styleEnt.itemStyle,
           itemLeadingIcon: 'size-2 shrink-0 text-neutral-400!',
           itemLabel: 'whitespace-nowrap text-sm leading-4 w-20 text-start' }"
  >
    <UTooltip :text="$t('language')">
      <UButton
        class="active:bg-auto rounded-full! ring-0! p-1.5!"
        :class="styleEnt.buttonStyle"
        icon="hugeicons:translation"
        color="neutral"
        variant="outline"
        size="lg"
        :ui="{ leadingIcon: 'size-5.5' }"
      />
    </UTooltip>
  </UDropdownMenu>
</template>