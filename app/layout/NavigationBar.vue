<script setup>
import FuzzyText from '../components/error/FuzzyText.vue'
import TopBack from '../components/common/TopBack.vue'
import Language from '../components/common/Language.vue'
import Theme from '../components/common/Theme.vue'
import Search from '~/components/common/Search.vue'
import Console from '~/components/nav-po/Console.vue'
import Station from '~/components/nav-po/Station.vue'
import StationAll from '~/components/nav-po/StationAll.vue'
import Sign from '~/components/nav-po/Sign.vue'
</script>

<template>
  <div class="sticky top-0 z-50 bg-white/60 dark:bg-stone-800/20 backdrop-blur-xl">
    <div class="mx-auto flex h-14.5 w-full max-w-7xl items-center justify-between px-2">
      <div class="flex items-center">
        <Station class="h-5.5 w-5.5 md:flex hidden" />
        <StationAll class="h-5.5 w-5.5 md:hidden flex" />
        <div class="text-xl px-1">
          云轩柒的小栈
        </div>
        <div class="text-xl px-1">
          {{ $t('homePage') }}
        </div>
        <div class="text-xl px-1">
          {{ $t('archived') }}
        </div>
        <div class="text-xl px-1">
          {{ $t('categories') }}
        </div>
        <div class="text-xl px-1">
          {{ $t('tags') }}
        </div>
      </div>
      <div class="flex items-center gap-2">
        <Search />

        <!-- hover:bg-(--ui-nav-cpt-bg)
             :button-style="'hover:bg-orange-500'"
        -->
        <Theme class="lg:flex hidden" />

        <!-- hover:bg-(--ui-nav-fyi-bg)2 bg-(--ui-nav-fyi-bg)
             :button-style="'hover:bg-orange-500'"
             :item-style="'hover:bg-orange-500'"
             :select-style="'bg-orange-500'"
         -->
        <Language class="lg:flex hidden" />

        <Console class="md:flex hidden" />
        <Sign />

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
