<script setup>
const { locales, setLocale } = useI18n()

</script>
<template>
    <button v-for="locale in locales" @click="setLocale(locale.code)">
        {{ locale.name }}
    </button>
    <h1>{{$t('homePage')}}</h1>
</template>