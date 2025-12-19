<template>
  <header class="f1-header">
    <div class="f1-container f1-header__inner">
      <div class="f1-header__brand">
        <a class="f1-logo" href="#">
          <span class="f1-logo__icon">
            <span class="material-symbols-outlined">speed</span>
            <span class="f1-logo__glint"></span>
          </span>
          <span class="f1-logo__text">
            <span class="f1-logo__title">F1<span class="f1-logo__accent">.HUB</span></span>
            <span class="f1-logo__tagline">Telemetry System</span>
          </span>
        </a>
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
          <RouterLink class="f1-nav__cta" to="#">Live Data</RouterLink>
        </nav>
      </div>
      <div class="f1-header__actions">
        <F1Button class="f1-menu-button" size="sm" square type="button" aria-label="Open menu">
          <span class="material-symbols-outlined">menu</span>
        </F1Button>
        <div class="f1-actions">
          <F1Input v-model="searchQuery" class="f1-search" icon="search" placeholder="SEARCH DATABASE..." />
          <F1Button
            class="f1-access"
            variant="solid"
            :accent="'var(--neon-red)'"
            :textColor="'#000'"
            type="button"
          >
            Access ID
          </F1Button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import F1Button from '../components/F1Button.vue'
import F1Input from '../components/F1Input.vue'

const searchQuery = ref('')
const route = useRoute()

const navItems = [
  { label: 'Home', path: '/home' },
  { label: 'Drivers', path: '/drivers' },
  { label: 'News', path: '/news' },
  { label: 'Teams', path: '/teams' },
  { label: 'Seasons', path: '/seasons' },
]

const isActive = (path: string) => route.path.startsWith(path)
</script>

<style scoped lang="scss">
.f1-header {
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 16px 24px;
  background: rgba(5, 5, 5, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
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
  gap: 40px;
}

.f1-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
}

.f1-logo__icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: var(--shadow-red);
  overflow: hidden;
  transition: background 0.2s ease;
}

.f1-logo__icon .material-symbols-outlined {
  font-size: 32px;
  color: var(--neon-red);
  transition: color 0.2s ease;
}

.f1-logo__glint {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.2));
  opacity: 0;
  transition: opacity 0.2s ease;
}

.f1-logo:hover .f1-logo__icon {
  background: var(--neon-red);
}

.f1-logo:hover .f1-logo__icon .material-symbols-outlined {
  color: #000;
}

.f1-logo:hover .f1-logo__glint {
  opacity: 1;
}

.f1-logo__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.f1-logo__title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.2em;
}

.f1-logo__accent {
  color: var(--neon-red);
}

.f1-logo__tagline {
  font-family: var(--font-tech);
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--text-dim);
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

.f1-actions {
  display: none;
  align-items: center;
  gap: 16px;
}

:deep(.f1-menu-button) {
  --f1-button-bg: rgba(255, 255, 255, 0.05);
  --f1-button-border: rgba(255, 255, 255, 0.1);
  --f1-button-text: #fff;
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
</style>
