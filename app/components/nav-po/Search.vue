<script setup lang="ts">
const searchOpen = ref(false)
const searchTerm = ref('')
const isWide = ref(true)

const styleEnt = withDefaults(defineProps<
  {
    buttonStyle?: string
    spanStyle?: string
  }>(), {
  buttonStyle: 'bg-transparent max-md:hover:bg-(--ui-nav-cpt-bg) md:bg-zinc-100 md:dark:bg-zinc-800 md:text-stone-600 md:dark:text-stone-400 text-highlighted',
  spanStyle: 'dark:border-neutral-700 dark:bg-mauve-800 border-neutral-400/20 bg-neutral-500/10'
})
const onResize = (e: MediaQueryListEvent) => {
  isWide.value = e.matches
}
let mql: MediaQueryList

const { data: users, status, execute } = await useLazyFetch('https://jsonplaceholder.typicode.com/users', {
  key: 'modal-command-palette-users',
  query: { q: searchTerm },
  transform: (data: { id: number, name: string, email: string }[]) => {
    return data?.map(user => ({ id: user.id, label: user.name, suffix: user.email, avatar: { src: `https://i.pravatar.cc/120?img=${user.id}`, loading: 'lazy' as const } })) || []
  },
  immediate: false
})

const groups = computed(() => [{
  id: 'users',
  label: searchTerm.value ? `Users matching “${searchTerm.value}”...` : 'Users',
  items: users.value || [],
  ignoreFilter: true
}])

function onOpen() {
  if (!users.value?.length) {
    execute()
  }
}

defineShortcuts({
  ctrl_k: {
    usingInput: false,
    handler: () => {
      searchOpen.value = true
    }
  },
  meta_k: {
    usingInput: false,
    handler: () => {
      searchOpen.value = true
    }
  }
})

onMounted(() => {
  mql = window.matchMedia('(min-width: 768px)')
  isWide.value = mql.matches
  mql.addEventListener('change', onResize)
  onBeforeUnmount(() => mql.removeEventListener('change', onResize))
})
</script>

<template>
  <UModal
    v-model:open="searchOpen"
    :ui="{ overlay: 'bg-(--ui-mask)/60 backdrop-blur-xl' }"
    @update:open="onOpen"
  >
    <UButton
      class="inline-flex justify-center h-8.5 min-w-8.5 rounded-full md:px-2 px-1.5 py-1.5 ring-0 hover:text-highlighted"
      :class="styleEnt.buttonStyle"
      color="neutral"
      variant="subtle"
    >
      <span
        v-auto-animate
        class="flex items-center gap-1"
      >
        <UIcon
          name="hugeicons:search-01"
          class="h-5.5 w-5.5 md:h-4.5 md:w-4.5 shrink-0"
        />
        <template v-if="isWide">
          <span class="text-left text-xs px-1 mt-px">
            {{ $t('search') }}
          </span>
          <span
            class="rounded-r-xl rounded-l-md border px-1.5 py-0.5 text-xs leading-4"
            :class="styleEnt.spanStyle"
          >
            Ctrl K
          </span>
        </template>
      </span>
    </UButton>
    <template #content>
      <UCommandPalette
        v-model:search-term="searchTerm"
        :loading="status === 'pending'"
        :groups="groups"
        placeholder="Search users..."
        class="h-120 w-120"
      />
    </template>
  </UModal>
</template>
