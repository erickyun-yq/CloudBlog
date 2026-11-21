<script setup>
import FuzzyText from './error/FuzzyText.vue'
import TopBack from './nav-po/TopBack.vue'
import Language from './nav-po/Language.vue'
import Theme from './nav-po/Theme.vue'
</script>

<template>
  <Theme
    :button-style="'hover:bg-orange-500'"
    class="absolute right-9"
  />

  <Language
    :button-style="'hover:bg-orange-500'"
    :item-style="'hover:bg-orange-500'"
    :select-style="'bg-orange-500'"
  />
  <TopBack
    :show-top="false"
    class="relative! top-120"
  />
  <h1>{{ $t('homePage') }}</h1>

  <FuzzyText :text="'404'" />
</template>
