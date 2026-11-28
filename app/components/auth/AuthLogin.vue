<script setup lang="ts">
import type { ToggleGroupItem } from '@nuxt/ui/components/ToggleGroup.vue'

const show = ref(false)
const account = ref('')
const password = ref('')
const verifyCode = ref('')
const loginType = ref('verify')
const emailFormatError = ref('')
const verifyCodeFormatError = ref('')
const requestCodeError = ref('')
const codeCountdown = ref(0)
const isRequestingCode = ref(false)

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const verifyCodePattern = /^\d{6}$/
const isEmailValid = computed(() => emailPattern.test(account.value.trim()))
const emailError = computed(() => emailFormatError.value || requestCodeError.value)
// For the code field, show local format feedback before a server-reported error.
const codeError = computed(() => verifyCodeFormatError.value || authProps.verifyCodeError || '')
let codeCountdownTimer: ReturnType<typeof setInterval> | undefined

const authProps = defineProps<{
  loginError?: string
  verifyCodeError?: string
  componentType?: string
}>()

// The parent handles authentication and navigation. Request-code callbacks report
// the asynchronous send result so this component can manage the resend cooldown.
const emit = defineEmits<{
  'login': [payload: {
    account: string
    password: string
    verifyCode: string
    loginType: string
  }]
  'component': [payload: {
    componentType: string
  }]
  'clear-errors': []
  'request-code': [payload: {
    email: string
    onSuccess: () => void
    onError: (message: string) => void
  }]
}>()

const items = ref<ToggleGroupItem[]>([
  {
    label: $t('accountLogin'),
    value: 'account'
  },
  {
    label: $t('verifyCode'),
    value: 'verify'
  },
  {
    label: $t('passKey'),
    value: 'passkey'
  }
])

// Clear credentials, validation/server errors, and any active cooldown on mode changes.
const onLoginType = (value: string | undefined) => {
  if (value !== undefined && value !== loginType.value) {
    account.value = ''
    password.value = ''
    verifyCode.value = ''
    emailFormatError.value = ''
    verifyCodeFormatError.value = ''
    requestCodeError.value = ''
    isRequestingCode.value = false
    stopCodeCountdown()
    loginType.value = value
    emit('clear-errors')
  }
}

const stopCodeCountdown = () => {
  if (codeCountdownTimer) {
    clearInterval(codeCountdownTimer)
    codeCountdownTimer = undefined
  }
  codeCountdown.value = 0
}

// Start the cooldown only after the parent confirms success. The shared stop helper
// also clears the interval before restarting it or when the component unmounts.
const startCodeCountdown = () => {
  stopCodeCountdown()
  codeCountdown.value = 60
  codeCountdownTimer = setInterval(() => {
    if (codeCountdown.value <= 1) {
      stopCodeCountdown()
      return
    }

    codeCountdown.value -= 1
  }, 1000)
}

onBeforeUnmount(() => {
  stopCodeCountdown()
})

// Called on email blur and before requesting a code; empty input is handled by button state.
const validateEmail = () => {
  const value = account.value.trim()
  emailFormatError.value = value && !emailPattern.test(value) ? $t('invalidEmail') : ''
}

// Editing the email clears local email/request errors and asks the parent to clear
// stale server errors for the previous credentials.
const clearEmailFormatError = () => {
  emailFormatError.value = ''
  requestCodeError.value = ''
  emit('clear-errors')
}

// The verification code must contain exactly six digits; this runs when its input loses focus.
const validateVerifyCode = () => {
  const value = verifyCode.value.trim()
  verifyCodeFormatError.value = value && !verifyCodePattern.test(value)
    ? $t('invalidVerifyCode')
    : ''
}

// Editing the code clears its local format error and any stale server error from the parent.
const clearVerifyCodeFormatError = () => {
  verifyCodeFormatError.value = ''
  emit('clear-errors')
}

const clearLoginError = () => {
  emit('clear-errors')
}

const isLoginDisabled = computed(() => {
  // Account mode requires username/password; verify mode requires valid email/six-digit code.
  // Passkey mode has no text fields and delegates authentication to the parent.
  if (loginType.value === 'account') {
    return !account.value.trim() || !password.value.trim()
  }

  if (loginType.value === 'verify') {
    const email = account.value.trim()
    const code = verifyCode.value.trim()
    return !email || !code || !emailPattern.test(email) || !verifyCodePattern.test(code)
  }

  if (loginType.value === 'passkey') {
    return false
  }

  return true
})

const onLogin = () => {
  if (isLoginDisabled.value) {
    return
  }

  emit('login', {
    account: account.value,
    password: password.value,
    verifyCode: verifyCode.value,
    loginType: loginType.value
  })
}

const onComponent = (value: string | undefined) => {
  if (value !== undefined) {
    emit('component', {
      componentType: value
    })
  }
}

const onRequestCode = () => {
  validateEmail()

  // Reject invalid email, duplicate requests, and active cooldowns before emitting
  // the trimmed address to the parent.
  if (!isEmailValid.value || isRequestingCode.value || codeCountdown.value > 0) {
    return
  }

  requestCodeError.value = ''
  const requestedEmail = account.value.trim()
  isRequestingCode.value = true
  emit('request-code', {
    email: requestedEmail,
    onSuccess: () => {
      isRequestingCode.value = false
      requestCodeError.value = ''
      if (loginType.value === 'verify' && account.value.trim() === requestedEmail) {
        startCodeCountdown()
      }
    },
    onError: (message) => {
      isRequestingCode.value = false
      requestCodeError.value = message
    }
  })
}
</script>

<template>
  <UToggleGroup
    :model-value="loginType"
    :items="items"
    active-variant="solid"
    :ui="{
      root: 'mb-6',
      item: 'text-lg max-sm:text-sm mx-3 px-0 rounded-none border-b-2 text-default/88 border-transparent hover:bg-transparent active:bg-transparent data-[state=on]:border-blue-700 data-[state=on]:text-blue-700 data-[state=on]:bg-transparent',
    }"
    @update:model-value="onLoginType($event?.toString())"
  />

  <!-- One form hosts the conditional password and email-code login flows. -->
  <form
    autocomplete="on"
    @submit.prevent="onLogin"
  >
    <div v-if="loginType === 'account'">
      <!-- These names and autocomplete values help password managers identify credentials. -->
      <UInput
        v-model="account"
        name="username"
        autocomplete="username"
        maxlength="64"
        class="w-[72%] min-w-36 max-sm:w-62"
        :placeholder="$t('account')"
        :ui="{
          base: 'h-10 rounded-lg bg-transparent placeholder:text-[14px] ring-[0.34px] hover:ring-blue-500 focus-visible:ring-blue-500 focus-visible:outline-none mb-6',
          trailing: 'pe-1',
        }"
        @update:model-value="clearLoginError"
      />
      <UInput
        v-model="password"
        name="password"
        autocomplete="current-password"
        maxlength="48"
        class="w-[72%] min-w-36 max-sm:w-62"
        :placeholder="$t('password')"
        :type="show ? 'text' : 'password'"
        :ui="{
          base: `h-10 rounded-lg bg-transparent placeholder:text-[14px] placeholder:tracking-normal ring-[0.34px] hover:ring-blue-500 focus-visible:ring-blue-500 focus-visible:outline-none ${show ? '' : 'tracking-[-4px]'}`,
          trailing: 'pe-1',
        }"
        @update:model-value="clearLoginError"
      >
        <template #trailing>
          <UButton
            type="button"
            color="neutral"
            variant="link"
            size="lg"
            :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
            :aria-label="show ? 'Hide password' : 'Show password'"
            :aria-pressed="show"
            aria-controls="password"
            @click="show = !show"
          />
        </template>
      </UInput>
      <p
        v-if="authProps.loginError"
        class="text-left text-[.8rem] text-red-500 mt-1 mx-auto w-[72%] min-w-36 max-sm:w-62"
      >
        {{ authProps.loginError }}
      </p>
    </div>

    <div v-else-if="loginType === 'verify'">
      <!-- Show local format errors or parent-reported errors beside the related fields. -->
      <div class="mb-6">
        <UInput
          v-model="account"
          name="email"
          autocomplete="email"
          maxlength="64"
          class="w-[72%] min-w-36 max-sm:w-62"
          type="email"
          :disabled="isRequestingCode"
          :placeholder="$t('email')"
          :ui="{
            base: 'h-10 rounded-lg bg-transparent placeholder:text-[14px] ring-[0.34px] hover:ring-blue-500 focus-visible:ring-blue-500 focus-visible:outline-none',
            trailing: 'pe-1',
          }"
          @blur="validateEmail"
          @update:model-value="clearEmailFormatError"
        />
        <p
          v-if="emailError"
          class="text-left text-[.8rem] text-red-500 mt-1 mx-auto w-[72%] min-w-36 max-sm:w-62"
        >
          {{ emailError }}
        </p>
      </div>
      <UInput
        v-model="verifyCode"
        name="one-time-code"
        autocomplete="one-time-code"
        class="w-[72%] min-w-36 max-sm:w-62"
        inputmode="numeric"
        maxlength="6"
        :placeholder="$t('code')"
        :ui="{
          base: 'h-10 rounded-lg bg-transparent placeholder:text-[14px] ring-[0.34px] hover:ring-blue-500 focus-visible:ring-blue-500 focus-visible:outline-none',
          trailing: 'pe-1',
        }"
        @blur="validateVerifyCode"
        @update:model-value="clearVerifyCodeFormatError"
      >
        <template #trailing>
          <UButton
            type="button"
            :color="isEmailValid && codeCountdown === 0 && !isRequestingCode ? 'info' : 'neutral'"
            variant="link"
            class="px-2"
            :disabled="!isEmailValid || codeCountdown > 0 || isRequestingCode"
            @click="onRequestCode"
          >
            {{
              codeCountdown > 0
                ? $t('resendCodeCountdown', { seconds: codeCountdown })
                : isRequestingCode
                  ? $t('sendingCode')
                  : $t('getCode')
            }}
          </UButton>
        </template>
      </UInput>
      <p
        v-if="codeError"
        class="text-left text-[.8rem] text-red-500 mt-1 mx-auto w-[72%] min-w-36 max-sm:w-62"
      >
        {{ codeError }}
      </p>
    </div>

    <div v-if="loginType === 'account' || loginType === 'verify'">
      <UButton
        type="submit"
        color="undefined"
        class="w-[72%] mt-6 h-9 min-w-36 max-sm:w-62 rounded-full text-[1rem] max-sm:text-sm line-flex items-center justify-center bg-blue-600 enabled:hover:bg-blue-700 disabled:hover:bg-blue-600 active:bg-blue-700 text-white"
        :disabled="isLoginDisabled"
      >
        {{ $t('login') }}
      </UButton>
    </div>
  </form>

  <!-- Account recovery and registration links are only relevant to password login. -->
  <div
    v-if="loginType === 'account'"
    class="flex justify-between text-left text-sm mx-auto w-[72%] min-w-36 max-sm:w-62 mt-6"
  >
    <p
      class="text-blue-700 cursor-pointer"
      @click="onComponent('forgetPassword')"
    >
      {{ $t('forgetPassword') }}
    </p>
    <p>
      {{ $t('noAccount') }}
      <span
        class="text-blue-700 cursor-pointer"
        @click="onComponent('signUp')"
      >
        {{ $t('signUp') }}
      </span>
    </p>
  </div>

  <!-- Passkey authentication is delegated to the parent through the login event. -->
  <div v-if="loginType === 'passkey'">
    <UButton
      type="button"
      color="primary"
      icon="flowbite:fingerprint-solid"
      class="w-[72%] mt-6 h-9 min-w-36 max-sm:w-62 rounded-full text-[1rem] max-sm:text-sm line-flex items-center justify-center bg-blue-600 enabled:hover:bg-blue-700 disabled:hover:bg-blue-600 active:bg-blue-700 text-white"
      :disabled="isLoginDisabled"
      @click="onLogin"
    >
    <span class="mt-0.5">{{ $t('passkeyLogin') }}</span>
    </UButton>
  </div>
</template>