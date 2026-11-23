<script setup>
import FuzzyText from '../components/error/FuzzyText.vue'
import TopBack from '../components/nav-po/TopBack.vue'
import Language from '../components/nav-po/Language.vue'
import Theme from '../components/nav-po/Theme.vue'
import Search from '~/components/nav-po/Search.vue'
import Console from '~/components/nav-po/Console.vue'
import Site from '~/components/nav-po/Site.vue'
</script>

<template>
  <div class="sticky top-0 z-50 bg-white/60 dark:bg-stone-800/20 backdrop-blur-xl">
    <div class="mx-auto flex h-14.5 w-full max-w-7xl items-center justify-between px-2 md:px-6">
      <div class="flex items-center">
        <Site class="h-5.5 w-5.5" />
      </div>
      <div class="flex items-center gap-2">
        <Search />
        <!-- hover:bg-(--ui-nav-cpt-bg)       :button-style="'hover:bg-orange-500'" -->

        <Theme class="lg:flex hidden" />
        <!-- hover:bg-(--ui-nav-fyi-bg)2 bg-(--ui-nav-fyi-bg)
     :button-style="'hover:bg-orange-500'"
      :item-style="'hover:bg-orange-500'"
      :select-style="'bg-orange-500'"
      -->
        <Language class="lg:flex hidden" />
        <Console class="md:flex hidden" />

        <div class="[&>button]:translate-x-0! [@media(width>1120px)]:block hidden">
          <!-- bg-(--ui-nav-cpt-bg)/70 hover:bg-(--ui-top-back) active:bg-(--ui-top-back) -->

          <TopBack :show-top="false" />
        </div>
      </div>
    </div>
  </div>

  <h1>{{ $t('homePage') }}</h1>

  <FuzzyText :text="'404'" />
</template>
