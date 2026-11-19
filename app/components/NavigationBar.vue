<script setup>
import FuzzyText from './error/FuzzyText.vue'
import ColorMode from './nav-po/ColorMode.vue'
import TopBack from './nav-po/TopBack.vue'
import Translation from './nav-po/Translation.vue'
</script>

<template>
  <ColorMode />
  <Translation />
  <TopBack :show-top="false" :container="isolate" class="relative! top-120"/>
  <h1>{{ $t('homePage') }}</h1>

  <!-- <FuzzyText /> -->
</template>
