<script setup lang="ts">
import { ref, watch } from 'vue'
import F1Button from './F1Button.vue'

const props = defineProps<{
  modelValue: boolean
  loading?: boolean
  error?: string | null
  resetMessage?: string | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [payload: { email: string; password: string }]
  forgot: [email: string]
  reset: [payload: { email: string; password: string }]
}>()

const email = ref('')
const password = ref('')
const newPassword = ref('')
const isReset = ref(false)

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      email.value = ''
      password.value = ''
      newPassword.value = ''
      isReset.value = false
    }
  }
)

const close = () => emit('update:modelValue', false)

const onSubmit = () => {
  if (!email.value || !password.value) return
  emit('submit', { email: email.value, password: password.value })
}

const forgotPassword = () => {
  isReset.value = true
}

const onReset = () => {
  if (!email.value || !newPassword.value) return
  emit('reset', { email: email.value, password: newPassword.value })
}

const backToLogin = () => {
  isReset.value = false
  password.value = ''
}
</script>

<template>
  <transition name="login-pop">
    <div v-if="modelValue" class="login-modal" role="dialog" aria-modal="true" @click="close">
      <div class="login-modal__card" :class="{ 'is-reset': isReset }" @click.stop>
        <div class="login-modal__halo"></div>
        <button class="login-modal__close" aria-label="Close" @click="close">
          <span class="material-symbols-outlined">close</span>
        </button>
        <div class="login-modal__inner">
          <div class="login-modal__face login-modal__face--front" :class="{ 'is-hidden': isReset }">
            <div class="login-modal__header">
              <p class="login-modal__eyebrow">{{ $t('login.secure') }}</p>
              <h3 class="login-modal__title">{{ $t('login.signIn') }}</h3>
              <p class="login-modal__hint">{{ $t('login.hint') }}</p>
            </div>
            <form class="login-modal__form" @submit.prevent="onSubmit">
              <label class="login-modal__field">
                <span>{{ $t('login.email') }}</span>
                <input v-model="email" type="email" required :placeholder="$t('login.email')" />
              </label>
              <label class="login-modal__field">
                <span>{{ $t('login.password') }}</span>
                <input v-model="password" type="password" required :placeholder="$t('login.password')" />
              </label>
              <p v-if="error" class="login-modal__error">{{ error }}</p>
              <F1Button
                class="login-modal__submit"
                size="lg"
                variant="solid"
                :accent="'var(--neon-red)'"
                :accentGlow="'rgba(239,26,45,0.4)'"
                :loading="loading"
                type="submit"
              >
                {{ $t('login.signIn') }}
              </F1Button>
              <button class="login-modal__forgot" type="button" @click="forgotPassword">
                {{ $t('login.forgot') }}
              </button>
            </form>
          </div>

          <div class="login-modal__face login-modal__face--back" :class="{ 'is-visible': isReset }">
            <div class="login-modal__header">
              <p class="login-modal__eyebrow">{{ $t('login.resetTitle') }}</p>
              <h3 class="login-modal__title">{{ $t('login.resetTitle') }}</h3>
              <p class="login-modal__hint">{{ $t('login.resetHint') }}</p>
            </div>
            <form class="login-modal__form" @submit.prevent="onReset">
              <label class="login-modal__field">
                <span>{{ $t('login.email') }}</span>
                <input v-model="email" type="email" required :placeholder="$t('login.email')" />
              </label>
              <label class="login-modal__field">
                <span>{{ $t('login.newPassword') }}</span>
                <input v-model="newPassword" type="password" required :placeholder="$t('login.newPassword')" />
              </label>
              <p v-if="resetMessage" class="login-modal__success">{{ resetMessage }}</p>
              <p v-if="error && !resetMessage" class="login-modal__error">{{ error }}</p>
              <F1Button
                class="login-modal__submit"
                size="lg"
                variant="solid"
                :accent="'var(--neon-blue)'"
                :accentGlow="'rgba(0,243,255,0.4)'"
                :loading="loading"
                type="submit"
              >
                {{ $t('login.resetTitle') }}
              </F1Button>
              <button class="login-modal__forgot" type="button" @click="backToLogin">
                {{ $t('login.remember') }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
.login-modal {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 20% 20%, rgba(239, 26, 45, 0.12), transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(0, 243, 255, 0.1), transparent 45%), rgba(0, 0, 0, 0.7);
  z-index: 100;
  padding: 18px;
  backdrop-filter: blur(6px);
}

.login-modal__card {
  position: relative;
  width: min(520px, 96vw);
  background: rgba(12, 14, 22, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  padding: 24px 22px 28px;
  display: grid;
  gap: 12px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.55);
  overflow: hidden;
  backdrop-filter: blur(16px);
  perspective: 1200px;
}

.login-modal__halo {
  position: absolute;
  inset: -20% 10% auto;
  height: 60%;
  background: radial-gradient(circle at 40% 40%, rgba(239, 26, 45, 0.35), transparent 55%),
    radial-gradient(circle at 70% 60%, rgba(0, 243, 255, 0.25), transparent 50%);
  filter: blur(22px);
  opacity: 0.8;
}

.login-modal__close {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border-radius: 10px;
  padding: 6px;
  cursor: pointer;
  z-index: 2;
}

.login-modal__header {
  position: relative;
  z-index: 2;
  display: grid;
  gap: 4px;
}

.login-modal__inner {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
  min-height: 320px;
}

.login-modal__card.is-reset .login-modal__inner {
  transform: rotateY(180deg);
}

.login-modal__face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  display: grid;
  gap: 10px;
}

.login-modal__face--back {
  transform: rotateY(180deg);
}

.login-modal__face.is-hidden {
  opacity: 0;
  pointer-events: none;
}

.login-modal__face.is-visible {
  opacity: 1;
  pointer-events: auto;
}

.login-modal__success {
  margin: 0;
  color: #22c55e;
  font-size: 13px;
}

.login-modal__eyebrow {
  margin: 0;
  font-family: var(--font-tech);
  letter-spacing: 0.2em;
  color: #9ca3af;
  text-transform: uppercase;
}

.login-modal__title {
  margin: 0;
  font-family: var(--font-display);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.login-modal__hint {
  margin: 0;
  color: #cbd5e1;
}

.login-modal__form {
  position: relative;
  z-index: 2;
  display: grid;
  gap: 12px;
}

.login-modal__field {
  display: grid;
  gap: 4px;
  color: #cbd5e1;
}

.login-modal__field input {
  width: 100%;
  padding: 11px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.login-modal__field input:focus {
  outline: 2px solid var(--neon-blue);
  box-shadow: 0 0 12px var(--shadow-blue);
}

.login-modal__error {
  margin: 0;
  color: #ef4444;
  font-size: 13px;
}

.login-modal__submit {
  width: 100%;
}

.login-modal__forgot {
  border: none;
  background: transparent;
  color: #9ca3af;
  text-decoration: underline;
  cursor: pointer;
  justify-self: center;
  letter-spacing: 0.06em;
}

.login-pop-enter-active,
.login-pop-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.login-pop-enter-from,
.login-pop-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
