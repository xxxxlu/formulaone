<template>
  <header :class="['f1-header', { 'is-solid': scrolled }]">
    <div class="f1-container f1-header__inner">
      <div class="f1-header__brand">
        <RouterLink class="f1-logo" to="/">
          <img class="f1-logo__img" :src="logo" alt="F1 Logo" />
        </RouterLink>
        <nav class="f1-nav">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="f1-nav__link"
            :class="{ 'is-active': isActive(item.path) }"
          >
            <span class="f1-nav__text">{{ item.label }}</span>
            <span class="material-symbols-outlined f1-nav__car" aria-hidden="true">sports_motorsports</span>
            <span class="f1-nav__trail" aria-hidden="true"></span>
          </RouterLink>
        </nav>
      </div>
      <div class="f1-header__actions">
        <F1Button class="f1-menu-button" size="sm" square type="button" aria-label="Open menu" @click="toggleMobile">
          <span class="material-symbols-outlined">menu</span>
        </F1Button>
        <div class="f1-actions">
          <F1Input v-model="searchQuery" class="f1-search" icon="search" :placeholder="t('header.search')" />
          <div class="f1-locale">
            <button :class="{ active: locale === 'en' || locale === 'en-US' }" type="button" @click="changeLocale('en')">
              EN
            </button>
            <button :class="{ active: locale === 'zh' }" type="button" @click="changeLocale('zh')">
              中
            </button>
          </div>
          <template v-if="authEnabled && !isAuthenticated">
            <F1Button
              class="f1-access"
              variant="solid"
              :accent="'var(--neon-red)'"
              :textColor="'#000'"
              type="button"
              @click="openLogin"
            >
              {{ t('header.login') }}
            </F1Button>
          </template>
          <template v-else-if="authEnabled">
            <div class="f1-user">
              <span class="f1-user__name">{{ session?.name || session?.email }}</span>
              <button class="f1-user__logout" type="button" @click="logout">{{ t('header.logout') }}</button>
            </div>
          </template>
        </div>
      </div>
      <F1Button
        class="f1-menu-button f1-menu-button--inline"
        size="sm"
        square
        type="button"
        aria-label="Open menu"
        @click="toggleMobile"
      >
        <span class="material-symbols-outlined">menu</span>
      </F1Button>
    </div>

    <transition name="f1-drawer">
      <div v-if="mobileOpen" class="f1-mobile-drawer" role="dialog" aria-modal="true">
        <div class="f1-mobile-drawer__header">
          <div class="f1-mobile-drawer__title">Menu</div>
          <F1Button size="sm" square aria-label="Close menu" @click="closeMobile">
            <span class="material-symbols-outlined">close</span>
          </F1Button>
        </div>
        <nav class="f1-mobile-drawer__nav">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="f1-mobile-link"
            :class="{ 'is-active': isActive(item.path) }"
            @click="closeMobile"
          >
            <span>{{ item.label }}</span>
            <span class="material-symbols-outlined">chevron_right</span>
          </RouterLink>
        </nav>
      </div>
    </transition>
    <transition name="f1-fade">
      <div v-if="mobileOpen" class="f1-mobile-backdrop" @click="closeMobile"></div>
    </transition>

    <LoginModal
      v-if="authEnabled"
      v-model="showLogin"
      :loading="loading"
      :error="errorMessage"
      :reset-message="resetMessage"
      @submit="submitLogin"
      @reset="submitReset"
      @forgot="handleForgot"
    />
  </header>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import F1Button from '../components/F1Button.vue'
import F1Input from '../components/F1Input.vue'
import logo from '../assets/logo-f1.svg'
import { useAuthState } from '../utils/authState'
import LoginModal from '../components/LoginModal.vue'

const searchQuery = ref('')
const route = useRoute()
const mobileOpen = ref(false)
const router = useRouter()
const showLogin = ref(false)
const authEnabled = false

const { session, isAuthenticated, login, resetPassword, logout, loading, errorMessage, resetMessage } = useAuthState()
const { t, locale } = useI18n()

const navItems = computed(() => [
  { label: t('nav.home'), path: '/home' },
  { label: t('nav.drivers'), path: '/drivers' },
  { label: t('nav.news'), path: '/news' },
  { label: t('nav.teams'), path: '/teams' },
  { label: t('nav.tracks'), path: '/tracks' },
  { label: t('nav.champions'), path: '/champions' },
  { label: t('nav.constructorChampions'), path: '/constructors' },
])

const scrolled = ref(false)
const handleScroll = () => {
  scrolled.value = window.scrollY > 100
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

const isActive = (path: string) =>
  path === '/home' ? route.path === '/home' || route.path === '/' : route.path.startsWith(path)

const toggleMobile = () => {
  mobileOpen.value = !mobileOpen.value
}

const closeMobile = () => {
  mobileOpen.value = false
}

const openLogin = () => {
  showLogin.value = true
}

const submitLogin = async (payload: { email: string; password: string }) => {
  try {
    await login(payload.email, payload.password)
    showLogin.value = false
    router.push('/home')
  } catch {
    // errorMessage already set in auth state
  }
}

const handleForgot = (email: string) => {
  const supportMail = 'mailto:support@formula-one.local?subject=Reset%20Password&body=Account:%20' + encodeURIComponent(email || '')
  window.open(supportMail, '_blank')
}

const submitReset = async (payload: { email: string; password: string }) => {
  try {
    await resetPassword(payload.email, payload.password)
  } catch {
    // error handled in auth state
  }
}

const changeLocale = (lang: string) => {
  locale.value = lang
  localStorage.setItem('f1_locale', lang)
}

watch(
  () => route.path,
  () => {
    closeMobile()
  }
)
</script>

<style scoped lang="scss">
.f1-header {
  position: sticky;
  top: 0;
  z-index: 40;
  padding: 16px 24px;
  background: rgba(10, 10, 18, 0);
  border-bottom: 1px solid rgba(255, 255, 255, 0);
  box-shadow: none;
  transition: background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease;
  backdrop-filter: blur(0px);
}

.f1-header.is-solid {
  background: linear-gradient(90deg, rgba(9, 14, 24, 0.95), rgba(12, 22, 34, 0.9));
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(8px);
}

.f1-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.f1-header__brand {
  display: flex;
  align-items: center;
  gap: 28px;
}

.f1-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
}

.f1-logo__img {
  height: 32px;
  width: auto;
  filter: drop-shadow(0 0 10px rgba(0, 243, 255, 0.35));
}

.f1-nav {
  display: none;
  align-items: center;
  gap: 8px;
}

.f1-nav__link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--text-dim);
  transition: color 0.2s ease, transform 0.15s ease, text-shadow 0.2s ease;
  overflow: hidden;
}

.f1-nav__link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 3px;
  background: var(--neon-blue);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.2s ease;
  box-shadow: var(--shadow-blue);
  filter: drop-shadow(0 0 6px rgba(0, 243, 255, 0.6));
}

.f1-nav__link::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 16px;
  background: radial-gradient(60% 100% at 20% 100%, rgba(0, 243, 255, 0.25), transparent 70%);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.f1-nav__car {
  position: absolute;
  left: -24px;
  bottom: -8px;
  font-size: 18px;
  color: var(--neon-blue);
  opacity: 0;
  transform: translateX(-120%) rotate(-6deg);
  text-shadow: 0 0 8px rgba(0, 243, 255, 0.8);
}

.f1-nav__link:hover .f1-nav__car,
.f1-nav__link.is-active .f1-nav__car {
  opacity: 1;
  animation: nav-car-run 0.7s ease-out forwards;
}

.f1-nav__trail {
  position: absolute;
  left: 0;
  bottom: 2px;
  height: 2px;
  width: 0;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0), var(--neon-blue), rgba(255, 255, 255, 0));
  opacity: 0;
  box-shadow: 0 0 12px rgba(0, 243, 255, 0.6);
  transition: width 0.35s ease, opacity 0.2s ease;
}

.f1-nav__link:hover .f1-nav__trail,
.f1-nav__link.is-active .f1-nav__trail {
  width: 100%;
  opacity: 1;
}

.f1-nav__link:hover {
  color: #fff;
  text-shadow: 0 0 8px rgba(0, 243, 255, 0.6);
}

.f1-nav__link:hover::after {
  transform: scaleX(1);
}

.f1-nav__link:active {
  transform: translateY(1px);
}

.f1-nav__link.is-active {
  color: #fff;
  text-shadow: 0 0 8px rgba(0, 243, 255, 0.6);
}

.f1-nav__link.is-active::after {
  transform: scaleX(1);
}

.f1-nav__link:hover::before,
.f1-nav__link.is-active::before {
  opacity: 1;
}

.f1-nav__cta {
  margin-left: 12px;
  padding: 8px 18px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--neon-blue);
  transition: all 0.2s ease;
}

.f1-nav__cta:hover {
  background: var(--neon-blue);
  color: #000;
  box-shadow: var(--shadow-blue);
}

@keyframes nav-car-run {
  0% {
    transform: translateX(-120%) rotate(-6deg) scale(0.95);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    transform: translateX(120%) rotate(2deg) scale(1.02);
    opacity: 0;
  }
}

.f1-header__actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.f1-user {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.f1-user__name {
  font-family: var(--font-tech);
  letter-spacing: 0.12em;
  color: #e5e7eb;
}

.f1-user__logout {
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  padding: 4px 8px;
  border-radius: 8px;
  cursor: pointer;
  letter-spacing: 0.08em;
}

.f1-actions {
  display: none;
  align-items: center;
  gap: 16px;
}

.f1-locale {
  display: inline-flex;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  overflow: hidden;
}

.f1-locale button {
  background: transparent;
  color: #9ca3af;
  border: none;
  padding: 6px 10px;
  cursor: pointer;
  font-family: var(--font-tech);
  letter-spacing: 0.14em;
}

.f1-locale button.active {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

:deep(.f1-menu-button) {
  --f1-button-bg: rgba(255, 255, 255, 0.05);
  --f1-button-border: rgba(255, 255, 255, 0.1);
  --f1-button-text: #fff;
}
.f1-menu-button--inline {
  display: none;
  z-index: 60;
}

:deep(.f1-search) {
  --f1-control-bg: rgba(0, 0, 0, 0.45);
  --f1-control-border: rgba(255, 255, 255, 0.1);
  --f1-control-text: #fff;
  --f1-control-muted: var(--text-dim);
  --f1-control-accent: var(--neon-blue);
  --f1-control-ring: var(--shadow-blue);
  --f1-control-font: var(--font-tech);
}

:deep(.f1-search .f1-input__control) {
  width: 220px;
  height: 36px;
  letter-spacing: 0.2em;
}

:deep(.f1-search .f1-input__control::placeholder) {
  color: #4b5563;
}

@media (min-width: 1024px) {
  .f1-nav {
    display: flex;
  }

  .f1-actions {
    display: flex;
  }

  :deep(.f1-menu-button) {
    display: none;
  }
}

@media (max-width: 1024px) {
  .f1-header {
    padding: 12px 18px;
  }

  .f1-header__inner {
    gap: 12px;
  }

  .f1-header__brand {
    gap: 18px;
  }

  .f1-logo__img {
    height: 24px;
  }

  .f1-logo__title {
    font-size: 18px;
    letter-spacing: 0.16em;
  }

  .f1-logo__tagline {
    font-size: 9px;
    letter-spacing: 0.22em;
  }

  .f1-nav__link {
    padding: 6px 10px;
    font-size: 11px;
    letter-spacing: 0.14em;
  }

  .f1-actions {
    display: flex;
  }

  :deep(.f1-search .f1-input__control) {
    width: 180px;
  }
}

@media (max-width: 768px) {
  .f1-header {
    padding: 10px 14px;
  }

  .f1-header__inner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .f1-header__brand {
    gap: 12px;
  }

  .f1-nav {
    display: none;
  }

  .f1-header__actions {
    display: none;
  }

  .f1-menu-button--inline {
    display: inline-flex;
  }
}

.f1-mobile-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(2px);
  z-index: 80;
}

.login-modal {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.75);
  z-index: 100;
  padding: 18px;
  backdrop-filter: blur(4px);
}

.login-modal__card {
  position: relative;
  width: min(420px, 95vw);
  background: #0b0e14;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 18px 18px 22px;
  display: grid;
  gap: 10px;
}

.login-modal__close {
  position: absolute;
  top: 8px;
  right: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border-radius: 8px;
  padding: 6px;
  cursor: pointer;
}

.login-modal__title {
  margin: 0;
  font-family: var(--font-display);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.login-modal__hint {
  margin: 0;
  color: #9ca3af;
}

.login-modal__form {
  display: grid;
  gap: 10px;
}

.login-modal__field {
  display: grid;
  gap: 4px;
  color: #cbd5e1;
}

.login-modal__field input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
}

.login-modal__error {
  margin: 0;
  color: #ef4444;
  font-size: 13px;
}

.f1-mobile-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: min(320px, 80vw);
  height: 100vh;
  background: rgba(10, 10, 15, 0.96);
  border-left: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: -12px 0 24px rgba(0, 0, 0, 0.35);
  z-index: 90;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 12px;
}

.f1-mobile-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.f1-mobile-drawer__title {
  font-family: var(--font-display);
  letter-spacing: 0.2em;
  font-size: 13px;
  text-transform: uppercase;
}

.f1-mobile-drawer__nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.f1-mobile-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  font-family: var(--font-display);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
  transition: all 0.2s ease;
}

.f1-mobile-link:hover,
.f1-mobile-link.is-active {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
}

.f1-fade-enter-active,
.f1-fade-leave-active {
  transition: opacity 0.2s ease;
}
.f1-fade-enter-from,
.f1-fade-leave-to {
  opacity: 0;
}

.f1-drawer-enter-active,
.f1-drawer-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.f1-drawer-enter-from,
.f1-drawer-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
