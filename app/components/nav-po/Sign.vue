<script setup lang="ts">
import HTooltip from '~/components/common/HTooltip.vue'
import AuthLogin from '../auth/AuthLogin.vue'

const open = ref(false)
const verifyCodeError = ref('')
const loginError = ref('')

const clearAuthErrors = () => {
  verifyCodeError.value = ''
  loginError.value = ''
}

defineShortcuts({
  o: () => open.value = !open.value
})
</script>

<template>
  <UModal
    v-model:open="open"
    close-icon="mingcute:close-fill"
    :close="{
      ui: {
        base: 'px-0! py-0! hover:bg-transparent w-7.5 h-7.5 rounded-full ring-1 ring-black/5 dark:ring-white/5 flex justify-center',
        leadingIcon: 'h-5.5 w-5.5 hover:opacity-80 opacity-30',
      },
    }"
    :ui="{
      content: 'w-[88dvw] h-150  max-sm:h-[77dvh] min-w-88 max-w-md max-h-none rounded-2xl ring-0',
      header: 'border-0 px-3! py-3',
      wrapper: 'px-0 py-0',
      body: 'px-3! py-3! text-center',
    }"
  >
    <HTooltip
      v-slot="{ triggerProps }"
      :text="$t('signIn')"
    >
      <UButton
        v-bind="triggerProps"
        class="flex justify-center items-center rounded-md min-w-11 max-h-7 ring-0 max-md:bg-transparent max-md:min-w-6"
        :class="'bg-(--ui-nav-cpt-bg) hover:text-highlighted max-md:hover:bg-transparent'"
        color="neutral"
        variant="subtle"
        icon="uix-solid:user"
        :ui="{ leadingIcon: 'h-5.5 w-5.5 max-md:h-7 max-md:w-7' }"
      />
    </HTooltip>
    <template #body>
      <AuthLogin
        :verify-code-error="verifyCodeError"
        :login-error="loginError"
        @clear-errors="clearAuthErrors"
      />
    </template>
  </UModal>
</template>l