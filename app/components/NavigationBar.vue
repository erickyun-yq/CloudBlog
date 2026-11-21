<script setup>
import FuzzyText from './error/FuzzyText.vue'
import TopBack from './nav-po/TopBack.vue'
import Language from './nav-po/Language.vue'
import Theme from './nav-po/Theme.vue'
</script>

<template class="sticky z-200">
  <!-- hover:bg-(--ui-nav-cpt-bg) -->
  <Theme
    :button-style="'hover:bg-orange-500'"
    class="absolute right-9"
  />
  <!-- hover:bg-(--ui-nav-fyi-bg)2 bg-(--ui-nav-fyi-bg) -->
  <Language
    :button-style="'hover:bg-orange-500'"
    :item-style="'hover:bg-orange-500'"
    :select-style="'bg-orange-500'"
  />
  <!-- bg-(--ui-nav-cpt-bg)/70 hover:bg-(--ui-top-back) active:bg-(--ui-top-back) -->
  <TopBack
    :show-top="false"
    class="relative! -bottom-100 -right-14"
  />
  <h1>{{ $t('homePage') }}</h1>

  <FuzzyText :text="'404'" />
</template>
