<script setup lang="ts">
import HTooltip from '~/components/common/HTooltip.vue'
import AuthLogin from '../auth/AuthLogin.vue'

const open = ref(false)
const verifyCodeError = ref('')
const loginError = ref('')
const passkeyStatus = ref('')

const clearAuthErrors = () => {
  verifyCodeError.value = ''
  loginError.value = ''
  passkeyStatus.value = ''
}

const handleRequestCode = (request: {
  email: string
  onSuccess: () => void
  onError: (message: string) => void
}) => {
  request.onSuccess()
}

const handlePasskeyOptionsRequest = (request: {
  onSuccess: (options: PublicKeyCredentialRequestOptions) => void
  onError: (message: string) => void
}) => {
  passkeyStatus.value = ''
  if (!window.isSecureContext) {
    request.onError($t('passkeyUnavailable'))
    return
  }

  // Demo only: production must obtain a fresh challenge from the authentication server.
  try {
    const challenge = new ArrayBuffer(32)
    window.crypto.getRandomValues(new Uint8Array(challenge))
    request.onSuccess({
      challenge,
      rpId: window.location.hostname,
      timeout: 60_000,
      userVerification: 'preferred'
    })
  } catch {
    request.onError($t('passkeyFailed'))
  }
}

const handlePasskeyAssertion = (assertion: { response: { signature: string } }) => {
  passkeyStatus.value = assertion.response.signature
    ? $t('passkeyAssertionReady')
    : $t('passkeyFailed')
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
        :passkey-status="passkeyStatus"
        @clear-errors="clearAuthErrors"
        @request-code="handleRequestCode"
        @request-passkey-options="handlePasskeyOptionsRequest"
        @passkey-assertion="handlePasskeyAssertion"
      />
    </template>
  </UModal>
</template>l