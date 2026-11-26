<script setup lang="ts">
import type { ToggleGroupItem } from '@nuxt/ui/components/ToggleGroup.vue'

const show = ref(false)
const account = ref('')
const password = ref('')
const verifyCode = ref('')
const loginType = ref('account')

const props = defineProps<{
  loginError?: string
  verifyCodeError?: string
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
  if (value !== undefined) {
    loginType.value = value
  }
}

const isLoginDisabled = computed(() => {
  if (loginType.value === 'account') {
    return !account.value.trim() || !password.value.trim()
  }

  if (loginType.value === 'verify') {
    return !account.value.trim() || !verifyCode.value.trim()
  }

  return true
})

const emit = defineEmits<{
  login: [payload: {
    account: string,
    password: string,
    verifyCode: string,
    loginType: string
  }]
}>()

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
</script>

<template>
  <UToggleGroup
    :model-value="loginType"
    :items="items"
    active-variant="solid"
    :ui="{
      root: 'mb-6',
      item: 'text-lg max-sm:text-sm mx-3 px-0 rounded-none border-b-2 text-default/88 border-transparent hover:bg-transparent active:bg-transparent data-[state=on]:border-blue-900 data-[state=on]:text-blue-900 data-[state=on]:bg-transparent',
    }"
    @update:model-value="onLoginType($event?.toString())"
  />

  <div v-if="loginType === 'account' || loginType === 'verify'">
    <UInput
      v-model="account"
      class="w-[72%] min-w-36 max-sm:w-62"
      :placeholder="$t('account')"
      :ui="{
        base: 'h-10 rounded-lg bg-transparent placeholder:text-[14px] ring-[0.34px] hover:ring-blue-500 focus-visible:ring-blue-500 focus-visible:outline-none mb-6',
        trailing: 'pe-1',
      }"
    />
    <UInput
      v-if="loginType === 'account'"
      v-model="password"
      class="w-[72%] min-w-36 max-sm:w-62"
      :placeholder="$t('password')"
      :type="show ? 'text' : 'password'"
      :ui="{
        base: `h-10 rounded-lg bg-transparent placeholder:text-[14px] ring-[0.34px] hover:ring-blue-500 focus-visible:ring-blue-500 focus-visible:outline-none mb-6 ${show ? '' : 'tracking-[-6px]'}`,
        trailing: 'pe-1',
      }"
    >
      <template #trailing>
        <UButton
          class="mb-6"
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
    <UInput
      v-else
      v-model="verifyCode"
      class="w-[72%] min-w-36 max-sm:w-62"
      :placeholder="$t('verifyCode')"
      :ui="{
        base: 'h-10 rounded-lg bg-transparent placeholder:text-[14px] ring-[0.34px] hover:ring-blue-500 focus-visible:ring-blue-500 focus-visible:outline-none mb-6',
        trailing: 'pe-1',
      }"
    />
    <p v-if="props.loginError" class="text-sm text-red-500">
  {{ props.loginError }}
</p>
  </div>
  <div v-if="loginType === 'account' || loginType === 'verify'">
    <UButton
      type="button"
      color="undefined"
      class="w-[72%] h-9 min-w-36 max-sm:w-62 rounded-full text-[1rem] max-sm:text-sm line-flex items-center justify-center bg-blue-600 enabled:hover:bg-blue-700 disabled:hover:bg-blue-600 active:bg-blue-700 text-white"
      :disabled="isLoginDisabled"
      @click="onLogin"
    >
      {{ $t('login') }}
    </UButton>
  </div>
</template>