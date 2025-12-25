<template>
  <footer v-show="!hideFooter" class="f1-footer">
    <div class="f1-footer__bg"></div>
    <div class="f1-container f1-footer__inner">
      <div class="f1-footer__grid">
        <div class="f1-footer__brand card-float">
          <img class="f1-footer__logo" :src="logo" alt="F1 logo" />
          <div>
            <div class="f1-footer__title">{{ $t('footer.title') }}</div>
            <div class="f1-footer__tagline">{{ $t('footer.tagline') }}</div>
            <p class="f1-footer__about">{{ $t('footer.about') }}</p>
          </div>
        </div>

        <div class="f1-footer__column">
          <h4 class="f1-footer__heading">{{ $t('footer.links') }}</h4>
          <div class="f1-footer__links">
            <RouterLink to="/home">{{ $t('nav.home') }}</RouterLink>
            <RouterLink to="/drivers">{{ $t('nav.drivers') }}</RouterLink>
            <RouterLink to="/teams">{{ $t('nav.teams') }}</RouterLink>
            <RouterLink to="/tracks">{{ $t('nav.tracks') }}</RouterLink>
            <RouterLink to="/news">{{ $t('nav.news') }}</RouterLink>
            <RouterLink to="/champions">{{ $t('nav.champions') }}</RouterLink>
            <RouterLink to="/constructors">{{ $t('nav.constructorChampions') }}</RouterLink>
          </div>
        </div>

        <div class="f1-footer__column">
          <h4 class="f1-footer__heading">{{ $t('footer.contact') }}</h4>
          <div class="f1-footer__contact">
            <a href="mailto:xlu021104@gmail.com">
              <span class="material-symbols-outlined">alternate_email</span>
              <span>{{ $t('footer.contactEmail') }}</span>
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer">
              <span class="material-symbols-outlined">share</span>
              <span>{{ $t('footer.contactX') }}</span>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <span class="material-symbols-outlined">facebook</span>
              <span>{{ $t('footer.contactFacebook') }}</span>
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <span class="material-symbols-outlined">code</span>
              <span>{{ $t('footer.contactGithub') }}</span>
            </a>
          </div>
        </div>

        <div class="f1-footer__column">
          <h4 class="f1-footer__heading">{{ $t('footer.social') }}</h4>
          <div class="f1-footer__social">
            <a class="f1-footer__icon" href="#" :aria-label="$t('footer.socialGlobal')">
              <span class="material-symbols-outlined">public</span>
            </a>
            <a class="f1-footer__icon" href="#" :aria-label="$t('footer.socialEmail')">
              <span class="material-symbols-outlined">rss_feed</span>
            </a>
            <a class="f1-footer__icon" href="#" :aria-label="$t('footer.socialRss')">
              <span class="material-symbols-outlined">language</span>
            </a>
          </div>
          <div class="f1-footer__legal">
            <a href="#">{{ $t('footer.privacy') }}</a>
            <a href="#">{{ $t('footer.terms') }}</a>
            <a href="#">{{ $t('footer.data') }}</a>
          </div>
        </div>
      </div>

      <div class="f1-footer__bottom">
        <p>{{ $t('footer.copyright') }}</p>
        <p class="f1-footer__copy-muted">Telemetry Hub · {{ new Date().getFullYear() }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import logo from '../assets/logo-f1.svg'

const route = useRoute()
const hideFooter = computed(() => route.path === '/christmas')
</script>

<style scoped lang="scss">
.f1-footer {
  position: relative;
  z-index: 1;
  padding: 40px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, #0b0e14, #090c12);
  overflow: hidden;
}

.f1-footer__bg {
  position: absolute;
  inset: 0;
  background-size: 40px 40px;
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  opacity: 0.08;
  pointer-events: none;
}

.f1-footer__inner {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.f1-footer__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}

.f1-footer__brand {
  display: flex;
  align-items: center;
  gap: 14px;
  font-family: var(--font-display);
  padding: 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
  position: relative;
  overflow: hidden;
}

.f1-footer__logo {
  height: 26px;
  width: auto;
  filter: drop-shadow(0 0 10px rgba(225, 6, 0, 0.35));
}

.f1-footer__title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.15em;
}

.f1-footer__tagline {
  font-family: var(--font-tech);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--text-dim);
}

.f1-footer__about {
  margin: 6px 0 0;
  max-width: 360px;
  color: var(--text-muted);
  font-family: var(--font-tech);
  line-height: 1.5;
}

.f1-footer__column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.f1-footer__heading {
  margin: 0;
  font-family: var(--font-display);
  font-size: 14px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #fff;
}

.f1-footer__social {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.f1-footer__icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-muted);
  transition: all 0.2s ease;
}

.f1-footer__icon:hover {
  border-color: var(--neon-blue);
  color: var(--neon-blue);
  background: rgba(0, 243, 255, 0.1);
}

.f1-footer__links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px 14px;
}

.f1-footer__links a {
  font-family: var(--font-tech);
  color: var(--text-muted);
  letter-spacing: 0.04em;
  transition: color 0.2s ease, transform 0.2s ease;
}

.f1-footer__links a:hover {
  color: #fff;
  transform: translateX(2px);
}

.f1-footer__contact {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.f1-footer__contact a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  font-family: var(--font-tech);
  letter-spacing: 0.05em;
  transition: color 0.2s ease, transform 0.2s ease;
}

.f1-footer__contact a:hover {
  color: #fff;
  transform: translateX(3px);
}

.f1-footer__legal {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
  margin-top: 10px;
}

.f1-footer__legal a {
  color: var(--text-dim);
  font-family: var(--font-tech);
  letter-spacing: 0.05em;
  transition: color 0.2s ease;
}

.f1-footer__legal a:hover {
  color: #fff;
}

.f1-footer__bottom {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
  font-family: var(--font-tech);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--text-dim);
}

.f1-footer__copy-muted {
  color: var(--text-muted);
  letter-spacing: 0.12em;
}

.card-float {
  animation: floaty 6s ease-in-out infinite;
}

@keyframes floaty {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-4px);
  }
  100% {
    transform: translateY(0px);
  }
}

@media (max-width: 640px) {
  .f1-footer__bottom {
    letter-spacing: 0.12em;
  }
}
</style>
