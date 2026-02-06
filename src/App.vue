<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Header from './layout/header.vue'
import Footer from './layout/footer.vue'
import F1Button from './components/F1Button.vue'
import { isRouting, setRouting } from './utils/loadingState'

const route = useRoute()
const loading = computed(() => isRouting.value)
const showBackTop = ref(false)
const scrollProgress = ref(0)
const hideChrome = computed(() => route.name === 'christmas')
let revealObserver: IntersectionObserver | null = null

const updateViewportProgress = () => {
  showBackTop.value = window.scrollY > 200
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0
}

const revealElements = () => {
  const targets = document.querySelectorAll<HTMLElement>('.f1-reveal:not(.is-visible)')
  if (!targets.length) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach((el) => el.classList.add('is-visible'))
    return
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          revealObserver?.unobserve(entry.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
  }

  targets.forEach((el) => revealObserver?.observe(el))
}

const backToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  // ensure initial entry shows the loader briefly, then release
  setTimeout(() => setRouting(false), 1000)
  window.addEventListener('scroll', updateViewportProgress, { passive: true })
  updateViewportProgress()
  nextTick(revealElements)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateViewportProgress)
  revealObserver?.disconnect()
  revealObserver = null
})

watch(
  () => route.fullPath,
  () => {
    nextTick(() => {
      revealElements()
      updateViewportProgress()
    })
  }
)
</script>

<template>
  <div class="app-shell">
    <div v-if="!hideChrome" class="snow-overlay" aria-hidden="true">
      <div class="snow snow--near"></div>
      <div class="snow snow--far"></div>
    </div>

    <transition name="loader-fade">
      <div v-if="loading" class="f1-loader__overlay">
        <div class="f1-loader">
          <div class="f1-loader__frame">
            <svg
              class="f1-loader__logo"
              viewBox="0 0 1600 400"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="F1 loading"
            >
              <defs>
                <linearGradient id="f1-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#ef1a2d" stop-opacity="0" />
                  <stop offset="100%" stop-color="#ef1a2d" stop-opacity="1" />
                </linearGradient>
                <clipPath id="f1-clip">
                  <rect width="1600" height="400" fill="white" />
                </clipPath>
              </defs>
              <g class="f1-loader__paths" clip-path="url(#f1-clip)">
                <path
                  d="M1367.21 312.501C1379.83 312.501 1390.25 316.71 1398.5 325.168C1406.75 333.626 1410.88 344.001 1410.88 356.334C1410.88 368.667 1406.79 379.043 1398.58 387.418C1390.38 395.793 1380 400.001 1367.38 400.001C1354.75 400.001 1344.25 395.792 1335.92 387.334C1327.54 378.876 1323.38 368.501 1323.38 356.168C1323.38 343.835 1327.54 333.459 1335.83 325.084C1344.13 316.709 1354.59 312.501 1367.21 312.501ZM1167.04 149.792H635.292C501.959 149.792 473.584 160.083 403.667 227.875H403.708L226.292 400H0L281.542 120.583C386.208 17 436.667 4.27469e-06 615.125 0H1320.04L1167.04 149.792ZM1144.21 173.708L1003.96 313.958H641.125C574.625 313.958 559.917 317.083 526.917 350.083L477 400H267.167L422.292 244.875C483.209 184 504.209 173.708 638.5 173.708H1144.21ZM1600 0L1198.92 400H950.875L1350.88 0H1600ZM1367.13 319.376C1356.79 319.376 1348.13 322.96 1341.13 330.126C1334.17 337.293 1330.67 345.96 1330.67 356.168C1330.67 366.376 1334.17 375.042 1341.13 382.209C1348.09 389.376 1356.75 392.959 1367.13 392.959C1377.5 392.959 1386.13 389.418 1393.13 382.293C1400.09 375.168 1403.58 366.501 1403.58 356.251C1403.58 346.001 1400.09 337.293 1393.13 330.126C1386.17 322.959 1377.5 319.376 1367.13 319.376ZM1367.21 332.084C1373.5 332.084 1378.25 333.251 1381.42 335.626C1384.58 337.959 1386.17 341.501 1386.17 346.209C1386.17 350.917 1385.54 354.417 1384.25 356.709C1382.96 359.001 1380.79 360.834 1377.71 362.251L1386.83 380.668H1376.71L1368.42 363.501H1358.63L1358.58 363.459V380.626H1348.96V332.084H1367.21ZM1358.42 355.918H1368.21C1371.21 355.918 1373.38 355.293 1374.67 354.001C1376 352.709 1376.67 350.626 1376.67 347.751C1376.67 342.293 1373.25 339.584 1366.38 339.584H1358.42V355.918Z"
                />
              </g>
              <g class="f1-loader__fill" clip-path="url(#f1-clip)">
                <path
                  d="M1367.21 312.501C1379.83 312.501 1390.25 316.71 1398.5 325.168C1406.75 333.626 1410.88 344.001 1410.88 356.334C1410.88 368.667 1406.79 379.043 1398.58 387.418C1390.38 395.793 1380 400.001 1367.38 400.001C1354.75 400.001 1344.25 395.792 1335.92 387.334C1327.54 378.876 1323.38 368.501 1323.38 356.168C1323.38 343.835 1327.54 333.459 1335.83 325.084C1344.13 316.709 1354.59 312.501 1367.21 312.501ZM1167.04 149.792H635.292C501.959 149.792 473.584 160.083 403.667 227.875H403.708L226.292 400H0L281.542 120.583C386.208 17 436.667 4.27469e-06 615.125 0H1320.04L1167.04 149.792ZM1144.21 173.708L1003.96 313.958H641.125C574.625 313.958 559.917 317.083 526.917 350.083L477 400H267.167L422.292 244.875C483.209 184 504.209 173.708 638.5 173.708H1144.21ZM1600 0L1198.92 400H950.875L1350.88 0H1600ZM1367.13 319.376C1356.79 319.376 1348.13 322.96 1341.13 330.126C1334.17 337.293 1330.67 345.96 1330.67 356.168C1330.67 366.376 1334.17 375.042 1341.13 382.209C1348.09 389.376 1356.75 392.959 1367.13 392.959C1377.5 392.959 1386.13 389.418 1393.13 382.293C1400.09 375.168 1403.58 366.501 1403.58 356.251C1403.58 346.001 1400.09 337.293 1393.13 330.126C1386.17 322.959 1377.5 319.376 1367.13 319.376ZM1367.21 332.084C1373.5 332.084 1378.25 333.251 1381.42 335.626C1384.58 337.959 1386.17 341.501 1386.17 346.209C1386.17 350.917 1385.54 354.417 1384.25 356.709C1382.96 359.001 1380.79 360.834 1377.71 362.251L1386.83 380.668H1376.71L1368.42 363.501H1358.63L1358.58 363.459V380.626H1348.96V332.084H1367.21ZM1358.42 355.918H1368.21C1371.21 355.918 1373.38 355.293 1374.67 354.001C1376 352.709 1376.67 350.626 1376.67 347.751C1376.67 342.293 1373.25 339.584 1366.38 339.584H1358.42V355.918Z"
                />
              </g>
            </svg>
          </div>
          <p class="f1-loader__text">{{ $t('loader.initiating') }}</p>
        </div>
      </div>
    </transition>

    <div v-if="!hideChrome" class="f1-scroll-track" aria-hidden="true">
      <span class="f1-scroll-track__bar" :style="{ transform: `scaleX(${scrollProgress})` }"></span>
    </div>

    <Header v-if="!hideChrome" />
    <router-view v-slot="{ Component, route: currentRoute }">
      <transition name="page-shift" mode="out-in">
        <component :is="Component" :key="currentRoute.fullPath" />
      </transition>
    </router-view>
    <Footer v-if="!hideChrome" />

    <transition name="fade-up">
      <div v-if="showBackTop && !hideChrome" class="f1-backtop">
        <F1Button
          class="f1-backtop__btn"
          size="lg"
          square
          variant="solid"
          :accent="'var(--neon-blue)'"
          :accentGlow="'rgba(0,243,255,0.45)'"
          aria-label="Back to top"
          @click="backToTop"
        >
          <span class="material-symbols-outlined">arrow_upward</span>
        </F1Button>
      </div>
    </transition>
  </div>
</template>

<style lang="scss">
#app {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
}

.app-shell {
  position: relative;
  min-height: 100vh;
}

.f1-scroll-track {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 130;
  background: rgba(255, 255, 255, 0.06);
  pointer-events: none;
}

.f1-scroll-track__bar {
  display: block;
  width: 100%;
  height: 100%;
  transform-origin: 0 50%;
  background: linear-gradient(90deg, #00f3ff 0%, #7df7ff 45%, #ff003c 100%);
  box-shadow: 0 0 14px rgba(0, 243, 255, 0.5);
}

.snow-overlay {
  pointer-events: none;
  position: fixed;
  inset: 0;
  z-index: 10;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0;
}

.snow {
  position: absolute;
  inset: -20% 0 0 0;
  background-repeat: repeat;
  background-size: 280px 280px;
  opacity: 0.7;
  animation: snow-fall var(--speed, 18s) linear infinite;
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.25));
  mask-image: radial-gradient(circle at 50% 50%, black 60%, transparent 95%);
  mask-size: 200% 200%;
  mask-position: center;
}

.snow--near {
  --speed: 16s;
  background-image:
    radial-gradient(2px 2px at 20px 30px, rgba(255, 255, 255, 0.9) 60%, transparent 65%),
    radial-gradient(3px 3px at 120px 80px, rgba(255, 255, 255, 0.8) 55%, transparent 60%),
    radial-gradient(2.5px 2.5px at 200px 160px, rgba(255, 255, 255, 0.85) 60%, transparent 65%),
    radial-gradient(3px 3px at 80px 220px, rgba(255, 255, 255, 0.9) 60%, transparent 65%),
    radial-gradient(3px 3px at 180px 40px, rgba(255, 255, 255, 0.8) 55%, transparent 60%),
    radial-gradient(2px 2px at 60px 180px, rgba(255, 255, 255, 0.9) 60%, transparent 65%),
    radial-gradient(4px 4px at 140px 200px, rgba(255, 255, 255, 0.85) 55%, transparent 60%),
    radial-gradient(2px 2px at 40px 240px, rgba(255, 255, 255, 0.9) 60%, transparent 65%);
  animation-delay: -4s;
}

.snow--far {
  --speed: 26s;
  opacity: 0.45;
  background-image:
    radial-gradient(1.5px 1.5px at 40px 60px, rgba(255, 255, 255, 0.7) 60%, transparent 65%),
    radial-gradient(1.8px 1.8px at 160px 140px, rgba(255, 255, 255, 0.65) 55%, transparent 60%),
    radial-gradient(1.6px 1.6px at 220px 40px, rgba(255, 255, 255, 0.7) 60%, transparent 65%),
    radial-gradient(1.5px 1.5px at 90px 180px, rgba(255, 255, 255, 0.7) 60%, transparent 65%),
    radial-gradient(2px 2px at 200px 220px, rgba(255, 255, 255, 0.7) 60%, transparent 65%),
    radial-gradient(1.8px 1.8px at 80px 260px, rgba(255, 255, 255, 0.65) 55%, transparent 60%);
}

@keyframes snow-fall {
  to {
    transform: translateY(20%);
  }
}

.loader-fade-enter-active,
.loader-fade-leave-active {
  transition: opacity 0.25s ease;
}
.loader-fade-enter-from,
.loader-fade-leave-to {
  opacity: 0;
}

.f1-loader__overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 20% 20%, rgba(239, 26, 45, 0.06), transparent 40%),
    radial-gradient(circle at 80% 60%, rgba(0, 243, 255, 0.05), transparent 45%),
    #050505;
  backdrop-filter: blur(4px);
}

.f1-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.f1-loader__frame {
  width: clamp(240px, 36vw, 420px);
  aspect-ratio: 4 / 1;
  position: relative;
  filter: drop-shadow(0 0 18px rgba(239, 26, 45, 0.35));
  overflow: hidden;
}

.f1-loader__logo {
  width: 100%;
  height: 100%;
}

.f1-loader__paths path,
.f1-loader__paths circle {
  fill: rgba(255, 255, 255, 0.08);
  stroke: rgba(255, 255, 255, 0.12);
  stroke-width: 1;
}

.f1-loader__fill {
  position: absolute;
  inset: 0;
  clip-path: inset(0 0 100% 0);
  animation: f1-fill 2.2s ease-in-out infinite;
}

.f1-loader__fill path,
.f1-loader__fill circle {
  fill: url(#f1-fill);
}

.f1-loader__text {
  margin: 0;
  font-family: 'Chakra Petch', 'Orbitron', 'Manrope', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 12px;
  color: #cbd5f5;
  opacity: 0.8;
}

@keyframes f1-fill {
  0% {
    clip-path: inset(0 0 100% 0);
  }
  60% {
    clip-path: inset(0 0 0 0);
  }
  100% {
    clip-path: inset(0 0 100% 0);
  }
}

.f1-backtop {
  position: fixed;
  right: 22px;
  bottom: 26px;
  z-index: 1200;
}

.f1-backtop__btn {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.3), 0 0 12px rgba(0, 243, 255, 0.18);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, background 0.18s ease;
  position: relative;
  overflow: hidden;
}

.f1-backtop__btn::after {
  content: '';
  position: absolute;
  inset: -40%;
  background: radial-gradient(circle, rgba(0, 243, 255, 0.32), transparent 55%);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.f1-backtop__btn:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.32);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.5), 0 0 18px rgba(0, 243, 255, 0.28);
}

.f1-backtop__btn:hover::after {
  opacity: 1;
}

.f1-backtop__btn .material-symbols-outlined {
  font-size: 22px;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.page-shift-enter-active,
.page-shift-leave-active {
  transition: opacity 0.32s var(--ease-standard), transform 0.32s var(--ease-standard),
    filter 0.32s var(--ease-standard);
}

.page-shift-enter-from {
  opacity: 0;
  transform: translate3d(0, 12px, 0) scale(0.995);
  filter: blur(6px);
}

.page-shift-leave-to {
  opacity: 0;
  transform: translate3d(0, -8px, 0);
  filter: blur(4px);
}
</style>
