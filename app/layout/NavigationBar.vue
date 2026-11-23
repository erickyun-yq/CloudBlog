<script setup>
import FuzzyText from '../components/error/FuzzyText.vue'
import TopBack from '../components/nav-po/TopBack.vue'
import Language from '../components/nav-po/Language.vue'
import Theme from '../components/nav-po/Theme.vue'
import Search from '~/components/nav-po/Search.vue'
</script>

<template>
  <div class="sticky top-0 z-50 flex h-14.5 items-center justify-end gap-2 border-b border-b-gray-600 bg-white dark:bg-zinc-900">
    <Search />
    <!-- hover:bg-(--ui-nav-cpt-bg)       :button-style="'hover:bg-orange-500'" -->
    <Theme />
    <!-- hover:bg-(--ui-nav-fyi-bg)2 bg-(--ui-nav-fyi-bg)
     :button-style="'hover:bg-orange-500'"
      :item-style="'hover:bg-orange-500'"
      :select-style="'bg-orange-500'"
      -->
    <Language />
    <!-- bg-(--ui-nav-cpt-bg)/70 hover:bg-(--ui-top-back) active:bg-(--ui-top-back) -->
    <div class="[&>button]:translate-x-0!">
      <TopBack :show-top="false" />
    </div>
  </div>

  <h1>{{ $t('homePage') }}</h1>

  <FuzzyText :text="'404'" />
</template>
