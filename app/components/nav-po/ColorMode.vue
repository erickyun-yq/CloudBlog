<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore } from '~/stores/ThemeStore';

const store = useThemeStore()

const toggleTheme = (event: MouseEvent) => {
    const button = event.currentTarget
    if (!(button instanceof HTMLElement)) {
        store.toggle()
        return
    }

    const rect = button.getBoundingClientRect()
    store.toggle({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
    })
}

onMounted(() => store.init())

</script>
<template>
    <UButton
        aria-label="Toggle color theme"
        class="hover:bg-sky-100 dark:hover:bg-neutral-800 active:bg-auto rounded-full border-solid p-1.5"
        color="neutral"
        size="xl"
        variant="ghost"
        @click="toggleTheme"
    >
        <template #leading>
            <span v-auto-animate="{ duration: 600, easing: 'ease-in-out' }" class="inline-flex">
                <UIcon
                    :key="store.theme"
                    :name="store.theme === 'dark'
                      ? 'line-md:sunny-filled-loop-to-moon-filled-loop-transition'
                      : 'line-md:moon-filled-alt-to-sunny-filled-loop-transition'"
                    class="h-6 w-6"
                />
            </span>
        </template>
    </UButton>
</template>
