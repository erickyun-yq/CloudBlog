<script setup lang="ts">
const route = useRoute()
const contentPath = decodeURI(route.path)
const slug = Array.isArray(route.params.slug)
  ? route.params.slug.join('/')
  : route.params.slug
const contentStem = `docus/${slug}`

const { data: page } = await useAsyncData('page-' + contentPath, async () => {
  const pageByPath = await queryCollection('content').path(contentPath).first()
  if (pageByPath) {
    return pageByPath
  }

  return queryCollection('content')
    .where('stem', '=', contentStem)
    .first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
</script>

<template>
  <ContentRenderer
    v-if="page"
    :value="page"
  />
</template>
