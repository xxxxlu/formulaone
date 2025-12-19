<template>
  <div class="f1-home">
    <section class="f1-hero">
      <div class="f1-container f1-hero__inner">
        <div class="f1-hero__content">
          <div class="f1-hero__status">
            <span class="f1-hero__status-dot"></span>
            <span class="f1-hero__status-text">2025 World Champion // Norris Live Feed</span>
          </div>
          <h1 class="f1-hero__title">
            LANDO
            <br />
            <span class="f1-hero__velocity text-glow-blue">NORRIS</span>
            <br />
            <span class="f1-hero__subtitle">WORLD CHAMPION 2025</span>
          </h1>
          <div class="f1-hero__accent"></div>
          <p class="f1-hero__lead">
            A title season built on relentless pace, clean execution, and a McLaren package that stayed
            ice-cool under pressure. Relive the decisive laps, data traces, and moments that sealed the crown.
          </p>
          <div class="f1-hero__actions">
            <F1Button
              class="f1-hero__primary"
              variant="solid"
              size="lg"
              :accent="'var(--neon-blue)'"
              :textColor="'#000'"
              type="button"
            >
              Watch Title Run
              <span class="material-symbols-outlined f1-hero__cta-icon">arrow_forward</span>
            </F1Button>
            <F1Button
              class="f1-hero__ghost"
              variant="ghost"
              size="lg"
              :accent="'var(--neon-red)'"
              type="button"
            >
              <span class="material-symbols-outlined f1-hero__cta-icon f1-hero__cta-icon--red">
                play_circle
              </span>
              Norris Story
            </F1Button>
          </div>
        </div>
        <div class="f1-hero__visual">
          <div class="f1-orbits">
            <div class="f1-orbit f1-orbit--primary"></div>
            <div class="f1-orbit f1-orbit--secondary"></div>
          </div>
          <div class="f1-hero-card rotate-3d">
            <div class="f1-hero-card__frame">
              <div class="f1-hero-card__glow"></div>
              <div class="f1-hero-card__image">
                <img
                  src="../assets/public/norchap.jpg"
                  alt="Formula 1 car speeding"
                />
                <div class="f1-hero-card__grid"></div>
                <div class="f1-hero-card__scan"></div>
                <div class="f1-hero-card__stat f1-hero-card__stat--left">
                  <span class="f1-stat__label">AERO LOAD</span>
                  <span class="f1-stat__value">12,450 <span class="f1-stat__unit">N</span></span>
                </div>
                <div class="f1-hero-card__stat f1-hero-card__stat--right">
                  <span class="f1-stat__label">DRS STATUS</span>
                  <span class="f1-stat__value">
                    <span class="f1-stat__dot"></span>
                    CLOSED
                  </span>
                </div>
              </div>
            </div>
            <div class="f1-hero-card__shadow"></div>
          </div>
        </div>
      </div>
    </section>

    <main class="f1-main">
      <div class="f1-container f1-main__inner">
        <section class="f1-next f1-card">
          <div class="f1-next__panel f1-next__panel--info">
            <div class="f1-next__marker">
              <span class="material-symbols-outlined">flag</span>
              <span>{{ countdown.total <= 0 ? 'Lights Out' : 'Up Next' }}</span>
            </div>
            <h3 class="f1-next__title">
              <span v-if="activeEvent?.flag" class="f1-next__flag">{{ activeEvent.flag }}</span>
              {{ activeEvent?.name || 'Season Complete' }}
            </h3>
            <div class="f1-next__location">
              <span class="material-symbols-outlined">location_on</span>
              <span>{{ activeEvent?.location || 'Awaiting Calendar' }}</span>
            </div>
          </div>
          <div class="f1-next__panel f1-next__panel--countdown">
            <div class="f1-countdown">
              <div class="f1-countdown__segment">
                <div class="f1-countdown__value-shell">
                  <transition name="flip">
                    <div :key="countdown.days" class="f1-countdown__value">
                      {{ pad(countdown.days) }}
                    </div>
                  </transition>
                </div>
                <span class="f1-countdown__label">Days</span>
              </div>
              <span class="f1-countdown__sep">:</span>
              <div class="f1-countdown__segment">
                <div class="f1-countdown__value-shell">
                  <transition name="flip">
                    <div :key="countdown.hours" class="f1-countdown__value">
                      {{ pad(countdown.hours) }}
                    </div>
                  </transition>
                </div>
                <span class="f1-countdown__label">Hrs</span>
              </div>
              <span class="f1-countdown__sep">:</span>
              <div class="f1-countdown__segment">
                <div class="f1-countdown__value-shell">
                  <transition name="flip">
                    <div :key="countdown.minutes" class="f1-countdown__value">
                      {{ pad(countdown.minutes) }}
                    </div>
                  </transition>
                </div>
                <span class="f1-countdown__label">Mins</span>
              </div>
              <span class="f1-countdown__sep">:</span>
              <div class="f1-countdown__segment">
                <div class="f1-countdown__value-shell">
                  <transition name="flip">
                    <div
                      :key="countdown.seconds"
                      class="f1-countdown__value"
                      :class="{ 'f1-countdown__value--alert': countdown.total <= 0 }"
                    >
                      {{ pad(Math.max(0, countdown.seconds)) }}
                    </div>
                  </transition>
                </div>
                <span class="f1-countdown__label">Secs</span>
              </div>
            </div>
            <div v-if="countdown.total <= 0" class="f1-countdown__flag">
              <span class="f1-countdown__flag-emoji">{{ activeEvent?.flag }}</span>
              <span class="f1-countdown__flag-text">Now Racing: {{ activeEvent?.name }}</span>
            </div>
          </div>
          <div class="f1-next__panel f1-next__panel--weather">
            <div class="f1-weather">
              <div class="f1-weather__icon f1-weather__icon--sun">
                <span class="material-symbols-outlined">sunny</span>
              </div>
              <div class="f1-weather__text">
                <span class="f1-weather__value">28°C</span>
                <span class="f1-weather__label">Air Temp</span>
              </div>
            </div>
            <div class="f1-weather__divider"></div>
            <div class="f1-weather">
              <div class="f1-weather__icon f1-weather__icon--heat">
                <span class="material-symbols-outlined">thermometer</span>
              </div>
              <div class="f1-weather__text">
                <span class="f1-weather__value">42°C</span>
                <span class="f1-weather__label">Track Temp</span>
              </div>
            </div>
          </div>
        </section>

        <section class="f1-dashboard">
          <div class="f1-dashboard__left">
            <div class="f1-telemetry f1-card">
              <div class="f1-telemetry__header">
                <h3>
                  CIRCUIT TELEMETRY
                  <span>{{ activeTrack?.name || 'V.2.0' }}</span>
                </h3>
                <F1Button
                  class="f1-telemetry__action"
                  variant="ghost"
                  size="sm"
                  square
                  transparent
                  type="button"
                  aria-label="Expand telemetry"
                  @click="openTrackFullscreen"
                >
                  <span class="material-symbols-outlined">fullscreen</span>
                </F1Button>
              </div>
              <div class="f1-telemetry__map">
                <div class="f1-telemetry__grid"></div>
                <div class="f1-telemetry__glow"></div>
                <img
                  :src="activeTrack?.image || defaultTrackImage"
                  :alt="activeTrack?.name || 'Circuit Map'"
                />
                <div class="f1-telemetry__marker">
                  <span class="f1-telemetry__pulse"></span>
                  <span class="f1-telemetry__dot"></span>
                  <span class="f1-telemetry__tooltip">SEC 1: 28.4s</span>
                </div>
              </div>
              <div v-if="activeTrack" class="f1-telemetry__tagline">
                <div>
                  <span class="f1-telemetry__tag">{{ activeTrack.tagline }}</span>
                  <p class="f1-telemetry__desc">{{ activeTrack.description }}</p>
                </div>
                <div class="f1-telemetry__meta">
                  <span class="f1-telemetry__meta-item">
                    <span class="material-symbols-outlined">straight</span>
                    {{ activeTrack.lengthKm }} km
                  </span>
                  <span class="f1-telemetry__meta-item">
                    <span class="material-symbols-outlined">flag</span>
                    {{ activeTrack.location }}
                  </span>
                </div>
              </div>
              <div class="f1-telemetry__metrics">
                <div class="f1-telemetry__metric">
                  <span>Length</span>
                  <strong>{{ activeTrack?.lengthKm || '--' }} <span>km</span></strong>
                </div>
                <div class="f1-telemetry__metric">
                  <span>Lap Record</span>
                  <strong class="text-glow-blue">1:21.046</strong>
                </div>
                <div class="f1-telemetry__metric">
                  <span>DRS Zones</span>
                  <strong>2</strong>
                </div>
              </div>
            </div>

            <div class="f1-news">
              <article
                v-for="item in newsFeatured"
                :key="item.slug"
                class="f1-news__card"
                :style="{ backgroundImage: `url(${item.hero})` }"
              >
                <div class="f1-news__tag">{{ item.tag }}</div>
                <RouterLink class="f1-news__link" :to="`/news/${item.slug}`">
                  <h4>{{ item.title }}</h4>
                  <div class="f1-news__meta">
                    <span>{{ item.author }}</span>
                    <span class="f1-news__dot"></span>
                    <span>{{ formatDate(item.publishedAt) }}</span>
                  </div>
                  <span class="material-symbols-outlined">arrow_forward</span>
                </RouterLink>
              </article>
              <div class="f1-news__more">
                <F1Button variant="ghost" size="sm" :accent="'var(--neon-blue)'" :textColor="'#fff'" to="/news">
                  More News
                </F1Button>
              </div>
            </div>
          </div>

          <div class="f1-dashboard__right">
            <div class="f1-standings f1-card">
              <div class="f1-standings__header">
                <h3>Standings</h3>
                <a href="#">Full Table</a>
              </div>
              <div class="f1-standings__list">
                <div class="f1-standings__item f1-standings__item--blue">
                  <span class="f1-standings__rank">01</span>
                  <span class="f1-standings__avatar">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzdQr5RthmCqqv127FrPlIajNtD1PQYrsuF8A3MrRHDGG3M3nA6m7NSVa_yFIVs87JpfjRpIXcHhx3bUdFJClC7cbRu69c1MGMEWT26muwRX1CEiVtXzyDed33VVDB3cqH2YTJplLWl1jzd7-gAz11QtgLf5BSCrTeDfVduGIgjXYLtCl-yYlxHL_Npwc_ntDV-oBUbKySYaI93ZgJ3KXSi_s6g5IRgtlfT5jdSMiTqrYC3hrq9PfP6tTwUXOBRDh44AW4nZY7l5ej"
                      alt="Verstappen"
                    />
                  </span>
                  <div class="f1-standings__details">
                    <div class="f1-standings__row">
                      <span>VERSTAPPEN</span>
                      <strong>295</strong>
                    </div>
                    <div class="f1-standings__bar">
                      <span style="width: 90%"></span>
                    </div>
                    <p>Red Bull Racing</p>
                  </div>
                </div>
                <div class="f1-standings__item f1-standings__item--orange">
                  <span class="f1-standings__rank">02</span>
                  <span class="f1-standings__avatar">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXYJn0RQqqa005SHwqQgavoF2bweB3NNWW8bFlPJNhsP0nA2XjkXjanbeWwuSLaY-NC58dPoj8NcqR-cFhV729_V12bswUgGyn3yMzHu_9Ht4wanQyqlV6YmnIcfUlDkqdnl0a4bX2DULYIF5PUcPod3fTd2GOikW5MSemU9GIAwEVbFVcq4pKEeENrJZ0GtU_N5QcOBza1GepKDVKM3PPy77_OBejPqfk4XduZBPhmTn6ssWFM7xSIdECMIsDOwU1-Mc1ez2IRl4n"
                      alt="Norris"
                    />
                  </span>
                  <div class="f1-standings__details">
                    <div class="f1-standings__row">
                      <span>NORRIS</span>
                      <strong>225</strong>
                    </div>
                    <div class="f1-standings__bar">
                      <span style="width: 65%"></span>
                    </div>
                    <p>McLaren</p>
                  </div>
                </div>
                <div class="f1-standings__item f1-standings__item--red">
                  <span class="f1-standings__rank">03</span>
                  <span class="f1-standings__avatar">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjQVwfMk6-Q919Fhaq4MgOKOW2IHuFOf3a6r5Ach-v_sf5zbaeWgRGsnB5EkPuIctnPscjK5VNIf1x3jo6IfbaQSDBuoM8-pxP-iLPLZqUv9zrxQ2DH9nJF_B0jFgo66DBfYAyibtqFdNe7D-65ip7ZU1XHBT1K-4IpPpzC2ATcB4fJvdYFAA7C-CIPyRsZztZ9sJNPY0I7_xtwJ0G2-f5DHQrZpRrfuLk3SWPA4ARmiC3HSTqu3e6k0i4BxHHGAFqdBRDrhcTBPvC"
                      alt="Leclerc"
                    />
                  </span>
                  <div class="f1-standings__details">
                    <div class="f1-standings__row">
                      <span>LECLERC</span>
                      <strong>192</strong>
                    </div>
                    <div class="f1-standings__bar">
                      <span style="width: 55%"></span>
                    </div>
                    <p>Ferrari</p>
                  </div>
                </div>
              </div>
              <div class="f1-standings__footer">
                <p>Constructor Leader</p>
                <div>
                  <span class="material-symbols-outlined">emoji_events</span>
                  <span>RED BULL RACING</span>
                </div>
              </div>
            </div>

            <div class="f1-lap f1-card">
              <h4>Fastest Lap Delta</h4>
              <div class="f1-lap__chart">
                <div class="f1-lap__bar" data-value="1:32.4" style="height: 40%"></div>
                <div class="f1-lap__bar" data-value="1:30.2" style="height: 50%"></div>
                <div class="f1-lap__bar" style="height: 45%"></div>
                <div class="f1-lap__bar" style="height: 70%"></div>
                <div class="f1-lap__bar f1-lap__bar--highlight" style="height: 85%"></div>
              </div>
              <div class="f1-lap__labels">
                <span>BHR</span>
                <span>SAU</span>
                <span>AUS</span>
                <span>JPN</span>
                <span>CHN</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <Teleport to="body">
      <transition name="fade-blur">
        <div v-if="showTrackFullscreen" class="f1-track-modal" @click="closeTrackFullscreen">
          <div class="f1-track-modal__content" @click.stop>
            <div class="f1-track-modal__header">
              <div>
                <p class="f1-track-modal__eyebrow">{{ activeEvent?.name }}</p>
                <h4 class="f1-track-modal__title">{{ activeTrack?.name || 'Circuit Map' }}</h4>
                <p class="f1-track-modal__meta">
                  {{ activeTrack?.location || activeEvent?.location }}
                  <span v-if="activeTrack?.lengthKm"> • {{ activeTrack.lengthKm }} km</span>
                </p>
              </div>
              <F1Button
                variant="ghost"
                size="sm"
                transparent
                square
                type="button"
                aria-label="Close track preview"
                @click="closeTrackFullscreen"
              >
                <span class="material-symbols-outlined">close</span>
              </F1Button>
            </div>
            <div class="f1-track-modal__body">
              <img
                :src="activeTrack?.image || defaultTrackImage"
                :alt="activeTrack?.name || 'Circuit Map'"
              />
              <p v-if="activeTrack" class="f1-track-modal__desc">
                {{ activeTrack.description }}
              </p>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import F1Button from '../components/F1Button.vue'
import type { RootState, Track } from '../store'

type CountdownEventWithTs = {
  id: string
  name: string
  location: string
  flag: string
  start: string
  trackId: string
  ts: number
}

const store = useStore<RootState>()

const shanghaiNow = () =>
  new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' })).getTime()

const now = ref(shanghaiNow())
const START_GRACE_MS = 5 * 60 * 1000
const defaultTrackImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBvUga1Bi2obxYy2fLD9T0i8BSG3uuJ-QaYASPie_CudX8pmTJC5LTtIPXeSg6o_xMuRQ5mhKy1PqY_wYd_0ogV99H9g_hblDtnYh1RMuzgWxCndU9I1EEJcqkULy4VDTkY_sCJrkVNxuBW37JMLYawC-xbtbxRVDQ_3efmNL4DTPIa-JyEDEcHxXsmGMZ8oPhcA6I7ZEhalCzlPzVl62efyWzxHlLNvVlGbGK1t3AAkyD5JpNJTKZkCBFjrVF8-OLdipcTNS32pMO8'

const sortedEvents = computed<CountdownEventWithTs[]>(() =>
  store.state.calendar
    .map((event) => ({ ...event, ts: new Date(event.start).getTime() }))
    .sort((a, b) => a.ts - b.ts)
)

const activeEvent = computed<CountdownEventWithTs | null>(() => {
  if (!sortedEvents.value.length) return null

  const ongoing = sortedEvents.value.find((event) => Math.abs(now.value - event.ts) <= START_GRACE_MS)
  const upcoming = sortedEvents.value.find((event) => event.ts >= now.value)

  return ongoing ?? upcoming ?? sortedEvents.value[sortedEvents.value.length - 1] ?? null
})

const activeTrack = computed<Track | null>(() => {
  if (!activeEvent.value) return null
  return store.state.tracks.find((track) => track.id === activeEvent.value?.trackId) ?? null
})

const countdown = reactive({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  total: 0,
})

const showTrackFullscreen = ref(false)
const newsItems = computed(() => store.state.news)
const newsFeatured = computed(() => newsItems.value.slice(0, 4))

let timer: number | undefined

const pad = (value: number) => value.toString().padStart(2, '0')
const formatDate = (date: string) => date.replace(/-/g, '.')

const updateCountdown = () => {
  now.value = shanghaiNow()
  const target = activeEvent.value
  if (!target) {
    countdown.days = countdown.hours = countdown.minutes = countdown.seconds = countdown.total = 0
    return
  }
  const diff = target.ts - now.value
  countdown.total = diff
  const totalSeconds = Math.max(0, Math.floor(diff / 1000))
  countdown.days = Math.floor(totalSeconds / 86400)
  countdown.hours = Math.floor((totalSeconds % 86400) / 3600)
  countdown.minutes = Math.floor((totalSeconds % 3600) / 60)
  countdown.seconds = totalSeconds % 60
}

const openTrackFullscreen = () => {
  showTrackFullscreen.value = true
}

const closeTrackFullscreen = () => {
  showTrackFullscreen.value = false
}

onMounted(() => {
  updateCountdown()
  timer = window.setInterval(updateCountdown, 1000)
})

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})
</script>

<style scoped lang="scss">
.f1-card {
  background: rgba(18, 18, 26, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
}

:deep(.f1-hero__primary) {
  --f1-button-accent: var(--neon-blue);
  --f1-button-accent-glow: rgba(0, 243, 255, 0.35);
  --f1-button-text-strong: #000;
}

:deep(.f1-hero__ghost) {
  --f1-button-bg: rgba(255, 255, 255, 0.05);
  --f1-button-border: rgba(255, 255, 255, 0.2);
  --f1-button-text: #fff;
  --f1-button-text-strong: #fff;
  --f1-button-accent: var(--neon-red);
  backdrop-filter: blur(6px);
}

.f1-hero__cta-icon {
  font-size: 18px;
}

.f1-hero__cta-icon--red {
  color: var(--neon-red);
}

.f1-hero {
  position: relative;
  z-index: 1;
  padding: 48px 24px 90px;
}

.f1-hero__inner {
  display: grid;
  gap: 48px;
  align-items: center;
}

.f1-hero__content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.f1-hero__status {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--neon-red);
  font-family: var(--font-tech);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.f1-hero__status-dot {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--neon-red);
}

.f1-hero__status-dot::after {
  content: '';
  position: absolute;
  inset: -6px;
  border: 1px solid rgba(255, 0, 60, 0.5);
  border-radius: 50%;
  animation: ping 1.6s ease-out infinite;
}

.f1-hero__title {
  font-family: var(--font-display);
  font-size: clamp(42px, 7vw, 96px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #fff;
}

.f1-hero__subtitle {
  font-size: clamp(20px, 3vw, 32px);
  letter-spacing: 0.28em;
  color: var(--text-muted);
  display: inline-block;
  margin-top: 6px;
}

.f1-hero__velocity {
  display: inline-block;
  background: linear-gradient(90deg, var(--neon-blue), #fff, var(--neon-blue));
  -webkit-background-clip: text;
  color: transparent;
  animation: pulse-slow 3s ease-in-out infinite;
}

.f1-hero__accent {
  width: 90px;
  height: 4px;
  background: linear-gradient(90deg, var(--neon-red), transparent);
}

.f1-hero__lead {
  max-width: 420px;
  padding-left: 20px;
  border-left: 2px solid rgba(255, 255, 255, 0.1);
  font-family: var(--font-tech);
  font-size: 18px;
  color: var(--text-muted);
}

.f1-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.f1-hero__visual {
  position: relative;
  display: grid;
  place-items: center;
  perspective: 1000px;
}

.f1-orbits {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}

.f1-orbit {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(0, 243, 255, 0.2);
}

.f1-orbit--primary {
  width: 80%;
  height: 80%;
  animation: spin 10s linear infinite;
}

.f1-orbit--secondary {
  width: 60%;
  height: 60%;
  border-style: dotted;
  border-color: rgba(255, 0, 60, 0.2);
  animation: spin-reverse 15s linear infinite;
}

.f1-hero-card {
  position: relative;
  z-index: 1;
  width: min(100%, 720px);
}

.f1-hero-card__frame {
  position: relative;
  padding: 4px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.45);
  overflow: hidden;
}

.f1-hero-card__glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 243, 255, 0.15), transparent);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.f1-hero-card:hover .f1-hero-card__glow {
  opacity: 1;
}

.f1-hero-card__image {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: #000;
}

.f1-hero-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.1);
  transition: transform 0.7s ease, filter 0.7s ease;
  filter: grayscale(30%) contrast(1.25);
}

.f1-hero-card:hover .f1-hero-card__image img {
  transform: scale(1);
  filter: grayscale(0%) contrast(1.1);
}

.f1-hero-card__grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(0, 243, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 243, 255, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.2;
}

.f1-hero-card__scan {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 46%,
    rgba(0, 243, 255, 0.6) 50%,
    transparent 54%,
    transparent 100%
  );
  opacity: 0.6;
  animation: scan 3s ease-in-out infinite;
}

.f1-hero-card__stat {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.f1-hero-card__stat--left {
  top: 32px;
  left: 32px;
}

.f1-hero-card__stat--right {
  right: 32px;
  bottom: 32px;
  text-align: right;
}

.f1-stat__label {
  font-family: var(--font-tech);
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--neon-blue);
}

.f1-hero-card__stat--right .f1-stat__label {
  color: var(--neon-red);
}

.f1-stat__value {
  font-family: var(--font-display);
  font-size: 22px;
  color: #fff;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.f1-stat__unit {
  font-size: 12px;
  color: var(--text-dim);
}

.f1-stat__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--neon-red);
  box-shadow: 0 0 8px rgba(255, 0, 60, 0.8);
}

.f1-hero-card__shadow {
  position: absolute;
  inset: 10px -16px -16px 10px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: var(--f1-card);
  z-index: -1;
}

.f1-main {
  position: relative;
  z-index: 1;
  padding: 0 24px 90px;
  margin-top: -40px;
}

.f1-main__inner {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.f1-next {
  display: grid;
  overflow: hidden;
}

.f1-next__panel {
  padding: 28px;
}

.f1-next__panel--info {
  background: linear-gradient(90deg, rgba(5, 5, 5, 0.9), transparent);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
}

.f1-next__panel--info::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--neon-red);
}

.f1-next__marker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-tech);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--neon-blue);
  margin-bottom: 12px;
}

.f1-next__marker .material-symbols-outlined {
  font-size: 18px;
  color: var(--neon-blue);
}

.f1-next__title {
  font-family: var(--font-display);
  font-size: 34px;
  font-weight: 800;
  text-transform: uppercase;
  margin: 0 0 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.f1-next__flag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  background: rgba(0, 243, 255, 0.08);
  border: 1px solid rgba(0, 243, 255, 0.15);
  box-shadow: 0 8px 20px rgba(0, 243, 255, 0.15);
  font-size: 18px;
}

.f1-next__location {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-tech);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--text-muted);
}

.f1-next__panel--countdown {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 243, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  gap: 12px;
  flex-wrap: wrap;
}

.f1-countdown {
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: center;
  perspective: 800px;
}

.f1-countdown__segment {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}

.f1-countdown__value-shell {
  position: relative;
  width: 64px;
  height: 80px;
  perspective: 800px;
}

.f1-countdown__value {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  background: #0f1116;
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.5);
  backface-visibility: hidden;
}

.f1-countdown__value--alert {
  color: var(--neon-red);
  border-color: rgba(255, 0, 60, 0.4);
}

.f1-countdown__label {
  font-family: var(--font-tech);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: var(--text-dim);
}

.f1-countdown__sep {
  font-size: 24px;
  color: #374151;
  margin-top: -20px;
}

.flip-enter-active,
.flip-leave-active {
  transition: transform 0.45s ease, opacity 0.45s ease;
  transform-style: preserve-3d;
  position: absolute;
  inset: 0;
}

.flip-enter-from {
  transform: rotateX(-90deg);
  opacity: 0;
}

.flip-leave-to {
  transform: rotateX(90deg);
  opacity: 0;
}

.f1-countdown__flag {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-left: 0;
  margin-top: 6px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(0, 243, 255, 0.2);
  background: rgba(0, 243, 255, 0.06);
  box-shadow: 0 8px 20px rgba(0, 243, 255, 0.1);
  backdrop-filter: blur(8px);
}

.f1-countdown__flag-emoji {
  font-size: 22px;
}

.f1-countdown__flag-text {
  font-family: var(--font-tech);
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--neon-blue);
}

.f1-next__panel--weather {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: linear-gradient(90deg, rgba(5, 5, 5, 0.9), transparent);
}

.f1-weather {
  display: flex;
  align-items: center;
  gap: 12px;
}

.f1-weather__icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.f1-weather__icon--sun {
  background: rgba(252, 238, 10, 0.1);
  border-color: rgba(252, 238, 10, 0.2);
}

.f1-weather__icon--sun .material-symbols-outlined {
  color: var(--neon-yellow);
}

.f1-weather__icon--heat {
  background: rgba(255, 0, 60, 0.1);
  border-color: rgba(255, 0, 60, 0.2);
}

.f1-weather__icon--heat .material-symbols-outlined {
  color: var(--neon-red);
}

.f1-weather__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.f1-weather__value {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
}

.f1-weather__label {
  font-family: var(--font-tech);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--text-dim);
}

.f1-weather__divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
}

.f1-dashboard {
  display: grid;
  gap: 32px;
}

.f1-dashboard__left {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.f1-telemetry {
  overflow: hidden;
}

.f1-telemetry__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.f1-telemetry__header h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 16px;
  letter-spacing: 0.1em;
}

.f1-telemetry__header h3 span {
  font-size: 10px;
  margin-left: 8px;
  color: var(--neon-blue);
}

:deep(.f1-telemetry__action) {
  --f1-button-text: var(--text-muted);
  --f1-button-text-strong: #fff;
  --f1-button-border: transparent;
  --f1-button-bg: transparent;
}

:deep(.f1-telemetry__action:hover) {
  --f1-button-text: #fff;
}

.f1-telemetry__map {
  position: relative;
  aspect-ratio: 21 / 9;
  background: #080a0f;
  padding: 28px;
  overflow: hidden;
}

.f1-telemetry__grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
}

.f1-telemetry__glow {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}

.f1-telemetry__glow::before {
  content: '';
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: rgba(0, 243, 255, 0.08);
  filter: blur(48px);
}

.f1-telemetry__map img {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0.85;
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.4));
}

.f1-telemetry__marker {
  position: absolute;
  top: 30%;
  left: 25%;
  display: flex;
  align-items: center;
  gap: 8px;
}

.f1-telemetry__pulse {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(255, 0, 60, 0.7);
  animation: ping 1.4s ease-out infinite;
  top: -4px;
  left: -4px;
}

.f1-telemetry__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--neon-red);
  position: relative;
  z-index: 1;
}

.f1-telemetry__tooltip {
  margin-left: 16px;
  padding: 6px 8px;
  background: rgba(0, 0, 0, 0.8);
  border-left: 2px solid var(--neon-red);
  font-family: var(--font-tech);
  font-size: 10px;
  color: #fff;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.f1-telemetry__map:hover .f1-telemetry__tooltip {
  opacity: 1;
}

.f1-telemetry__tagline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  margin: 12px 0 0;
  border-radius: 10px;
  background: linear-gradient(90deg, rgba(0, 243, 255, 0.08), rgba(255, 255, 255, 0));
  border: 1px solid rgba(0, 243, 255, 0.15);
  box-shadow: 0 12px 30px rgba(0, 243, 255, 0.08);
}

.f1-telemetry__tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(0, 243, 255, 0.12);
  border: 1px solid rgba(0, 243, 255, 0.25);
  font-family: var(--font-tech);
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--neon-blue);
  margin-bottom: 6px;
}

.f1-telemetry__desc {
  margin: 0;
  font-family: var(--font-tech);
  font-size: 12px;
  color: #e5e7eb;
  letter-spacing: 0.05em;
  max-width: 720px;
}

.f1-telemetry__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-family: var(--font-tech);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--text-dim);
}

.f1-telemetry__meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.f1-telemetry__meta-item .material-symbols-outlined {
  font-size: 14px;
  color: var(--neon-blue);
}

.f1-telemetry__metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
}

.f1-telemetry__metric {
  padding: 14px;
  text-align: center;
}

.f1-telemetry__metric span {
  display: block;
  font-family: var(--font-tech);
  font-size: 10px;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.f1-telemetry__metric strong {
  display: block;
  font-family: var(--font-display);
  font-size: 18px;
  margin-top: 6px;
}

.f1-telemetry__metric strong span {
  font-size: 10px;
}

.f1-news {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.f1-news__card {
  position: relative;
  aspect-ratio: 16 / 9;
  min-height: 200px;
  height: auto;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-size: cover;
  background-position: center;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 12px;
  transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
}

.f1-news__card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.88), rgba(0, 0, 0, 0.6), transparent);
  z-index: 0;
}

.f1-news__card h4,
.f1-news__card .material-symbols-outlined,
.f1-news__card .f1-news__tag {
  position: relative;
  z-index: 1;
}

.f1-news__card h4 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 18px;
  line-height: 1.3;
}

.f1-news__card .material-symbols-outlined {
  align-self: flex-end;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.f1-news__card:hover {
  transform: translateY(-4px);
}

.f1-news__card:hover .material-symbols-outlined {
  opacity: 1;
}

.f1-news__tag {
  align-self: flex-start;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid rgba(0, 243, 255, 0.5);
  background: rgba(0, 243, 255, 0.1);
  font-family: var(--font-tech);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--neon-blue);
}

.f1-news__link {
  position: relative;
  display: grid;
  gap: 10px;
  z-index: 1;
  text-decoration: none;
  color: #fff;
}

.f1-news__more {
  display: flex;
  align-items: center;
  justify-content: center;
}

.f1-news__meta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-tech);
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--text-dim);
}

.f1-news__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--neon-blue);
  box-shadow: 0 0 8px rgba(0, 243, 255, 0.5);
}

.f1-dashboard__right {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.f1-standings {
  overflow: hidden;
}

.f1-standings__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.f1-standings__header h3 {
  margin: 0;
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 14px;
}

.f1-standings__header a {
  font-family: var(--font-tech);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--neon-blue);
}

.f1-standings__list {
  display: flex;
  flex-direction: column;
}

.f1-standings__item {
  display: grid;
  grid-template-columns: auto auto 1fr;
  gap: 12px;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  transition: background 0.2s ease;
}

.f1-standings__item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 0.2s ease;
}

.f1-standings__item:hover {
  background: rgba(255, 255, 255, 0.04);
}

.f1-standings__item:hover::before {
  transform: scaleY(1);
}

.f1-standings__item--blue::before {
  background: var(--neon-blue);
}

.f1-standings__item--orange::before {
  background: #f97316;
}

.f1-standings__item--red::before {
  background: #ef4444;
}

.f1-standings__rank {
  font-family: var(--font-display);
  font-size: 22px;
  color: #4b5563;
}

.f1-standings__item--blue:hover .f1-standings__rank {
  color: var(--neon-blue);
}

.f1-standings__item--orange:hover .f1-standings__rank {
  color: #f97316;
}

.f1-standings__item--red:hover .f1-standings__rank {
  color: #ef4444;
}

.f1-standings__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid transparent;
  transition: border-color 0.2s ease;
}

.f1-standings__item--blue:hover .f1-standings__avatar {
  border-color: var(--neon-blue);
}

.f1-standings__item--orange:hover .f1-standings__avatar {
  border-color: #f97316;
}

.f1-standings__item--red:hover .f1-standings__avatar {
  border-color: #ef4444;
}

.f1-standings__details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.f1-standings__row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-family: var(--font-display);
  font-size: 14px;
}

.f1-standings__row strong {
  font-family: var(--font-tech);
  font-size: 14px;
}

.f1-standings__bar {
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: #1f2937;
  overflow: hidden;
}

.f1-standings__bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #2563eb, var(--neon-blue));
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.5);
}

.f1-standings__item--orange .f1-standings__bar span {
  background: linear-gradient(90deg, #ea580c, #fb923c);
  box-shadow: none;
}

.f1-standings__item--red .f1-standings__bar span {
  background: linear-gradient(90deg, #b91c1c, #ef4444);
  box-shadow: none;
}

.f1-standings__details p {
  margin: 0;
  font-family: var(--font-tech);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--text-dim);
}

.f1-standings__footer {
  padding: 14px 20px;
  background: linear-gradient(90deg, #111827, #030303);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  text-align: center;
}

.f1-standings__footer p {
  margin: 0 0 6px;
  font-family: var(--font-tech);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--text-dim);
}

.f1-standings__footer div {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-display);
  font-size: 12px;
}

.f1-standings__footer .material-symbols-outlined {
  color: var(--neon-yellow);
  font-size: 18px;
}

.f1-lap {
  padding: 18px 20px 22px;
  position: relative;
  overflow: hidden;
}

.f1-lap::before {
  content: '';
  position: absolute;
  top: -60px;
  right: -40px;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: rgba(0, 243, 255, 0.12);
  filter: blur(40px);
}

.f1-lap h4 {
  margin: 0 0 16px;
  font-family: var(--font-display);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.f1-lap__chart {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 120px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 8px;
}

.f1-lap__bar {
  position: relative;
  flex: 1;
  border-radius: 6px 6px 0 0;
  background: rgba(255, 255, 255, 0.15);
  transition: background 0.2s ease, box-shadow 0.2s ease;
}

.f1-lap__bar::after {
  content: attr(data-value);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 100%;
  margin-bottom: 6px;
  font-size: 10px;
  color: #fff;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.f1-lap__bar:hover {
  background: var(--neon-blue);
  box-shadow: 0 0 15px rgba(0, 243, 255, 0.5);
}

.f1-lap__bar:hover::after {
  opacity: 1;
}

.f1-lap__bar--highlight {
  background: linear-gradient(180deg, var(--neon-blue), #22d3ee);
  box-shadow: 0 0 12px rgba(0, 243, 255, 0.35);
}

.f1-lap__labels {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-tech);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--text-dim);
  margin-top: 10px;
}

.f1-track-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  z-index: 2000;
  padding: 24px;
}

.f1-track-modal__content {
  width: min(1080px, 100%);
  background: #0b0e14;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
  overflow: hidden;
}

.f1-track-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: linear-gradient(90deg, rgba(0, 243, 255, 0.08), transparent);
}

.f1-track-modal__eyebrow {
  margin: 0;
  font-family: var(--font-tech);
  font-size: 11px;
  letter-spacing: 0.2em;
  color: var(--neon-blue);
  text-transform: uppercase;
}

.f1-track-modal__title {
  margin: 4px 0 2px;
  font-family: var(--font-display);
  font-size: 22px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.f1-track-modal__meta {
  margin: 0;
  font-family: var(--font-tech);
  font-size: 12px;
  letter-spacing: 0.1em;
  color: var(--text-dim);
}

.f1-track-modal__body {
  padding: 16px 18px 22px;
  display: grid;
  gap: 12px;
}

.f1-track-modal__body img {
  width: 100%;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #000;
}

.f1-track-modal__desc {
  margin: 0;
  font-family: var(--font-tech);
  font-size: 13px;
  color: #e5e7eb;
  letter-spacing: 0.05em;
}

.fade-blur-enter-active,
.fade-blur-leave-active {
  transition: opacity 0.25s ease;
}

.fade-blur-enter-from,
.fade-blur-leave-to {
  opacity: 0;
}

@media (min-width: 768px) {
  .f1-news {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .f1-hero__inner {
    grid-template-columns: 5fr 7fr;
  }

  .f1-next {
    grid-template-columns: 4fr 5fr 3fr;
  }

  .f1-next__panel--info,
  .f1-next__panel--countdown {
    border-bottom: none;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
  }

  .f1-dashboard {
    grid-template-columns: 2fr 1fr;
    align-items: start;
  }
}
</style>
