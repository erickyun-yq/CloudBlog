<script setup>
import FuzzyText from './error/FuzzyText.vue'
import ColorMode from './nav-po/ColorMode.vue'
import TopBack from './nav-po/TopBack.vue'
import Translation from './nav-po/Translation.vue'


</script>

<template>
  <ColorMode :color-style="'hover:bg-orange-500'" />
  <Translation />
  <TopBack
    :show-top="false"
    class="relative! top-120"
  />
  <h1>{{ $t('homePage') }}</h1>

  <!-- <FuzzyText /> -->
</template>
