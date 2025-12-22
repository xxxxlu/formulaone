<template>
  <div class="f1-home">
    <HeroSection />
    <main class="f1-main">
      <div class="f1-container f1-main__inner">
        <NextCountdown :activeEvent="activeEvent" :countdown="countdown" />

        <section class="f1-dashboard">
          <div class="f1-dashboard__left">
            <TelemetrySection :activeTrack="activeTrack" :defaultTrackImage="defaultTrackImage" @openTrack="openTrackFullscreen" />
            <NewsSection :newsFeatured="newsFeatured" />
          </div>

          <div class="f1-dashboard__right">
            <StandingsSection :standings="standingsDisplay" :maxPoints="maxStandingsPoints" />
            <RacesSection :races="raceResultsDisplay" />
            <FastestLapsSection :laps="fastestLapsDisplay" />
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
import type { CountdownEventWithTs, StandingDisplay, RaceDisplay, CountdownState, FastestLapDisplay } from '../components/home/types'

const store = useStore<RootState>()

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

let timer: number | undefined

const maxStandingsPoints = computed(() => Math.max(...standings2025.value.map((s) => s.points), 1))

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

.f1-dashboard {
  display: grid;
  gap: 32px;
}

.f1-dashboard__left {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.f1-dashboard__right {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (min-width: 1024px) {
  .f1-dashboard {
    grid-template-columns: 2fr 1fr;
    align-items: start;
  }
}
</style>
