<script setup lang="ts">
import type { ToggleGroupItem } from '@nuxt/ui/components/ToggleGroup.vue'

const show = ref(false)
const account = ref('')
const password = ref('')
const verifyCode = ref('')
const loginType = ref('verify')
const emailFormatError = ref('')
const verifyCodeFormatError = ref('')

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const verifyCodePattern = /^\d{6}$/

const authProps = defineProps<{
  loginError?: string
  verifyCodeError?: string
  componentType?: string
}>()

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

const onLoginType = (value: string | undefined) => {
  if (value !== undefined && value !== loginType.value) {
    account.value = ''
    password.value = ''
    verifyCode.value = ''
    emailFormatError.value = ''
    verifyCodeFormatError.value = ''
    loginType.value = value
    emit('clear-errors')
  }
}

const validateEmail = () => {
  const value = account.value.trim()
  emailFormatError.value = value && !emailPattern.test(value) ? $t('invalidEmail') : ''
}

const clearEmailFormatError = () => {
  emailFormatError.value = ''
}

const validateVerifyCode = () => {
  const value = verifyCode.value.trim()
  verifyCodeFormatError.value = value && !verifyCodePattern.test(value)
    ? $t('invalidVerifyCode')
    : ''
}

const clearVerifyCodeFormatError = () => {
  verifyCodeFormatError.value = ''
}

const isLoginDisabled = computed(() => {
  if (loginType.value === 'account') {
    return !account.value.trim() || !password.value.trim()
  }

  if (loginType.value === 'verify') {
    const email = account.value.trim()
    const code = verifyCode.value.trim()
    return !email || !code || !emailPattern.test(email) || !verifyCodePattern.test(code)
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

  <form autocomplete="on" @submit.prevent="onLogin">
    <div v-if="loginType === 'account'">
      <UInput
        v-model="account"
        name="username"
        autocomplete="username"
        class="w-[72%] min-w-36 max-sm:w-62"
        :placeholder="$t('account')"
        :ui="{
          base: 'h-10 rounded-lg bg-transparent placeholder:text-[14px] ring-[0.34px] hover:ring-blue-500 focus-visible:ring-blue-500 focus-visible:outline-none mb-6',
          trailing: 'pe-1',
        }"
      />
      <UInput
        v-model="password"
        name="password"
        autocomplete="current-password"
        class="w-[72%] min-w-36 max-sm:w-62"
        :placeholder="$t('password')"
        :type="show ? 'text' : 'password'"
        :ui="{
          base: `h-10 rounded-lg bg-transparent placeholder:text-[14px] placeholder:tracking-normal ring-[0.34px] hover:ring-blue-500 focus-visible:ring-blue-500 focus-visible:outline-none ${show ? '' : 'tracking-[-4px]'}`,
          trailing: 'pe-1',
        }"
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
      <div class="mb-6">
        <UInput
          v-model="account"
          name="email"
          autocomplete="email"
          class="w-[72%] min-w-36 max-sm:w-62"
          type="email"
          :placeholder="$t('email')"
          :ui="{
            base: 'h-10 rounded-lg bg-transparent placeholder:text-[14px] ring-[0.34px] hover:ring-blue-500 focus-visible:ring-blue-500 focus-visible:outline-none',
            trailing: 'pe-1',
          }"
          @blur="validateEmail"
          @update:model-value="clearEmailFormatError"
        />
        <p
          v-if="emailFormatError"
          class="text-left text-[.8rem] text-red-500 mt-1 mx-auto w-[72%] min-w-36 max-sm:w-62"
        >
          {{ emailFormatError }}
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
      />
      <p
        v-if="verifyCodeFormatError || authProps.verifyCodeError"
        class="text-left text-[.8rem] text-red-500 mt-1 mx-auto w-[72%] min-w-36 max-sm:w-62"
      >
        {{ verifyCodeFormatError || authProps.verifyCodeError }}
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
</template>