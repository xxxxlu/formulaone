<template>
  <div class="f1-home">
    <HeroSection :activeEvent="activeEvent" :pulseItems="heroPulseItems" />
    <main class="f1-main">
      <div class="f1-container f1-main__inner">
        <section class="f1-season-pulse f1-surface f1-reveal" style="--reveal-delay: 70ms">
          <div class="f1-season-pulse__head">
            <p class="f1-kicker">{{ $t('home.heroTitle') }}</p>
            <h2>{{ $t('home.heroSubtitle') }}</h2>
          </div>
          <div class="f1-season-pulse__grid">
            <article v-for="item in heroPulseItems" :key="item.label" class="f1-season-pulse__item">
              <span class="f1-season-pulse__label">{{ item.label }}</span>
              <strong class="f1-season-pulse__value">{{ item.value }}</strong>
              <span class="f1-season-pulse__detail">{{ item.detail }}</span>
            </article>
          </div>
        </section>

        <div class="f1-reveal" style="--reveal-delay: 120ms">
          <NextCountdown :activeEvent="activeEvent" :countdown="countdown" />
        </div>

        <section class="f1-dashboard">
          <div class="f1-dashboard__left">
            <div class="f1-dashboard__head f1-reveal" style="--reveal-delay: 140ms">
              <p class="f1-kicker">{{ $t('tracks.title') }}</p>
              <h3>{{ $t('home.newsSection') }} · {{ $t('tracks.title') }}</h3>
            </div>
            <div class="f1-reveal" style="--reveal-delay: 190ms">
              <TelemetrySection
                :activeTrack="activeTrack"
                :defaultTrackImage="defaultTrackImage"
                @openTrack="openTrackFullscreen"
              />
            </div>
            <div class="f1-reveal" style="--reveal-delay: 240ms">
              <NewsSection :newsFeatured="newsFeatured" />
            </div>
          </div>

          <div class="f1-dashboard__right">
            <div class="f1-dashboard__head f1-reveal" style="--reveal-delay: 170ms">
              <p class="f1-kicker">{{ $t('home.standings') }}</p>
              <h3>{{ $t('home.raceResults') }} · {{ $t('home.fastest') }}</h3>
            </div>
            <div class="f1-reveal" style="--reveal-delay: 220ms">
              <StandingsSection :standings="standingsDisplay" :maxPoints="maxStandingsPoints" />
            </div>
            <div class="f1-reveal" style="--reveal-delay: 280ms">
              <RacesSection :races="raceResultsDisplay" />
            </div>
            <div class="f1-reveal" style="--reveal-delay: 340ms">
              <FastestLapsSection :laps="fastestLapsDisplay" />
            </div>
          </div>
        </section>
      </div>
    </main>

    <TrackModal
      :open="showTrackFullscreen"
      :activeTrack="activeTrack"
      :activeEvent="activeEvent"
      :defaultTrackImage="defaultTrackImage"
      @close="closeTrackFullscreen"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import HeroSection from '../components/home/HeroSection.vue'
import NextCountdown from '../components/home/NextCountdown.vue'
import TelemetrySection from '../components/home/TelemetrySection.vue'
import NewsSection from '../components/home/NewsSection.vue'
import StandingsSection from '../components/home/StandingsSection.vue'
import RacesSection from '../components/home/RacesSection.vue'
import FastestLapsSection from '../components/home/FastestLapsSection.vue'
import TrackModal from '../components/home/TrackModal.vue'
import type { RootState, Track } from '../store'
import { standings2025 as standings2025Data, type DriverStanding } from '../store/data/standings'
import { raceResults2025, type RaceResult } from '../store/data/race-results-2025'
import { fastestLaps2025, type FastestLapResult } from '../store/data/fastest-laps-2025'
import type {
  CountdownEventWithTs,
  StandingDisplay,
  RaceDisplay,
  CountdownState,
  FastestLapDisplay,
  HeroPulse,
} from '../components/home/types'

const store = useStore<RootState>()
const { t, locale } = useI18n()

const shanghaiNow = () =>
  new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' })).getTime()

const now = ref(shanghaiNow())
const START_GRACE_MS = 5 * 60 * 1000
const defaultTrackImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBvUga1Bi2obxYy2fLD9T0i8BSG3uuJ-QaYASPie_CudX8pmTJC5LTtIPXeSg6o_xMuRQ5mhKy1PqY_wYd_0ogV99H9g_hblDtnYh1RMuzgWxCndU9I1EEJcqkULy4VDTkY_sCJrkVNxuBW37JMLYawC-xbtbxRVDQ_3efmNL4DTPIa-JyEDEcHxXsmGMZ8oPhcA6I7ZEhalCzlPzVl62efyWzxHlLNvVlGbGK1t3AAkyD5JpNJTKZkCBFjrVF8-OLdipcTNS32pMO8'

const standings2025 = computed<DriverStanding[]>(() => standings2025Data)
const raceResults = computed<RaceResult[]>(() => raceResults2025)
const fastestLaps = computed<FastestLapResult[]>(() => fastestLaps2025)

const teamAliases: Record<string, string> = {
  ferrari: 'scuderia ferrari',
  mercedes: 'mercedes-amg',
  'mercedes-amg petronas': 'mercedes-amg',
}

const findTeam = (name: string) => {
  const key = name.toLowerCase()
  const normalizedName = teamAliases[key] ?? key
  return (
    store.state.teams.find((t) => t.name.toLowerCase() === normalizedName) ??
    store.state.teams.find(
      (t) => normalizedName.includes(t.name.toLowerCase()) || t.name.toLowerCase().includes(normalizedName)
    )
  )
}

const driverAccents = computed<Record<string, string>>(() =>
  store.state.drivers.reduce<Record<string, string>>((map, d) => {
    const fullName = `${d.firstName} ${d.lastName}`
    map[fullName] = d.accent
    map[d.lastName] = d.accent
    if (d.firstName === 'Alex') {
      map[`Alexander ${d.lastName}`] = d.accent
    }
    if (d.firstName.includes('Kimi') && d.lastName === 'Antonelli') {
      map['Kimi Antonelli'] = d.accent
    }
    return map
  }, {})
)

const standingsDisplay = computed<StandingDisplay[]>(() =>
  standings2025.value.map((s) => {
    const teamKey = s.team.toLowerCase()
    const driver = store.state.drivers.find(
      (d) =>
        `${d.firstName} ${d.lastName}`.toLowerCase() === s.driver.toLowerCase() ||
        d.lastName.toLowerCase() === (s.driver?.split(' ').slice(-1)[0] ?? '').toLowerCase()
    )
    const team = findTeam(teamKey)
    return {
      ...s,
      accent: driverAccents.value[s.driver] || driver?.accent || team?.color,
      avatar: driver?.image,
      teamLogo: team?.logo,
    }
  })
)

const raceResultsDisplay = computed<RaceDisplay[]>(() =>
  raceResults.value.map((r) => {
    const driver = store.state.drivers.find(
      (d) =>
        `${d.firstName} ${d.lastName}`.toLowerCase() === r.winner.toLowerCase() ||
        d.lastName.toLowerCase() === (r.winner?.split(' ').slice(-1)[0] ?? '').toLowerCase()
    )
    const team = findTeam(r.car)
    return {
      ...r,
      winnerAvatar: driver?.image,
      accent: driver?.accent || team?.color,
      teamLogo: team?.logo,
    }
  })
)

const fastestLapsDisplay = computed<FastestLapDisplay[]>(() =>
  fastestLaps.value.map((lap) => {
    const driver = store.state.drivers.find(
      (d) =>
        `${d.firstName} ${d.lastName}`.toLowerCase() === lap.driver.toLowerCase() ||
        d.lastName.toLowerCase() === (lap.driver?.split(' ').slice(-1)[0] ?? '').toLowerCase()
    )
    const team = driver ? findTeam(driver.team) : null
    return {
      ...lap,
      accent: driver?.accent || team?.color,
      avatar: driver?.image,
      teamLogo: team?.logo,
      car: driver?.team ?? team?.name,
    }
  })
)

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

const countdown = reactive<CountdownState>({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  total: 0,
})

const showTrackFullscreen = ref(false)
const newsItems = computed(() => store.state.news)
const newsFeatured = computed(() => newsItems.value.slice(0, 4))
const latestRaceResult = computed(() =>
  [...raceResultsDisplay.value].sort((a, b) => b.round - a.round)[0] ?? null
)
const latestFastestLap = computed(() =>
  [...fastestLapsDisplay.value].sort((a, b) => b.round - a.round)[0] ?? null
)

let timer: number | undefined

const maxStandingsPoints = computed(() => Math.max(...standings2025.value.map((s) => s.points), 1))
const leader = computed(() => standingsDisplay.value[0] ?? null)

const formatEventDate = (date: string) => {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return '--'
  return new Intl.DateTimeFormat(locale.value === 'zh' ? 'zh-CN' : 'en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed)
}

const heroPulseItems = computed<HeroPulse[]>(() => [
  {
    label: t('home.nextRace'),
    value: activeEvent.value?.name || '--',
    detail: activeEvent.value ? formatEventDate(activeEvent.value.start) : '--',
  },
  {
    label: t('home.driverStandingsTitle'),
    value: leader.value?.driver || '--',
    detail: leader.value ? `${leader.value.points} pts · ${leader.value.team}` : '--',
  },
  {
    label: t('home.raceResultsTitle'),
    value: latestRaceResult.value?.winner || '--',
    detail: latestRaceResult.value ? `${latestRaceResult.value.grandPrix} · ${latestRaceResult.value.time}` : '--',
  },
  {
    label: t('home.fastestLapsTitle'),
    value: latestFastestLap.value?.driver || '--',
    detail: latestFastestLap.value ? `${latestFastestLap.value.time} · ${latestFastestLap.value.grandPrix}` : '--',
  },
])

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
.f1-home {
  position: relative;
}

.f1-main {
  position: relative;
  z-index: 1;
  padding: 0 24px 96px;
  margin-top: -52px;
}

.f1-main__inner {
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.f1-season-pulse {
  padding: 18px 18px 20px;
}

.f1-season-pulse__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.f1-season-pulse__head h2 {
  margin: 0;
  font-family: var(--font-tech);
  font-size: 14px;
  letter-spacing: 0.08em;
  font-weight: 500;
  color: var(--text-muted);
}

.f1-season-pulse__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.f1-season-pulse__item {
  position: relative;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  background: linear-gradient(155deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.f1-season-pulse__item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(0, 243, 255, 0.12), rgba(255, 0, 60, 0.05), transparent 70%);
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-standard);
}

.f1-season-pulse__item:hover::before {
  opacity: 1;
}

.f1-season-pulse__label,
.f1-season-pulse__value,
.f1-season-pulse__detail {
  position: relative;
  z-index: 1;
}

.f1-season-pulse__label {
  display: block;
  margin-bottom: 6px;
  font-family: var(--font-tech);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--text-dim);
  font-size: 10px;
}

.f1-season-pulse__value {
  display: block;
  font-family: var(--font-display);
  letter-spacing: 0.06em;
  font-size: 15px;
  color: #f8fafd;
}

.f1-season-pulse__detail {
  display: block;
  margin-top: 4px;
  font-family: var(--font-tech);
  letter-spacing: 0.08em;
  font-size: 11px;
  color: var(--text-muted);
}

.f1-dashboard {
  display: grid;
  gap: 24px;
}

.f1-dashboard__left {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.f1-dashboard__right {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.f1-dashboard__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 10px;
}

.f1-dashboard__head h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(15px, 2vw, 18px);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #f8fbff;
}

@media (min-width: 1024px) {
  .f1-dashboard {
    grid-template-columns: 2fr 1fr;
    align-items: start;
  }
}

@media (max-width: 860px) {
  .f1-main {
    margin-top: -36px;
    padding: 0 16px 82px;
  }

  .f1-main__inner {
    gap: 20px;
  }

  .f1-season-pulse {
    padding: 14px;
  }

  .f1-season-pulse__head {
    flex-direction: column;
    align-items: flex-start;
  }

  .f1-season-pulse__grid {
    grid-template-columns: 1fr;
  }

  .f1-dashboard {
    gap: 18px;
  }

  .f1-dashboard__left,
  .f1-dashboard__right {
    gap: 14px;
  }
}
</style>
