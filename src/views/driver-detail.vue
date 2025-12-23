<template>
  <main v-if="driver" class="driver-detail" :style="themeVars">
    <section class="driver-hero">
      <div class="driver-hero__bg">
        <span class="driver-hero__orb driver-hero__orb--accent"></span>
        <span class="driver-hero__orb driver-hero__orb--soft"></span>
        <span class="driver-hero__grid"></span>
      </div>
      <div class="driver-hero__nav">
        <RouterLink class="driver-hero__back" to="/drivers">
          <span class="material-symbols-outlined">arrow_back</span>
          Back to roster
        </RouterLink>
      </div>
      <div class="driver-hero__content">
        <div class="driver-hero__info">
          <p class="driver-hero__eyebrow">Official telemetry profile</p>
          <h1 class="driver-hero__title">
            <span>{{ driver.firstName }}</span>
            <strong>{{ driver.lastName }}</strong>
          </h1>
          <div class="driver-hero__meta">
            <span class="driver-hero__meta-pill">
              <span class="material-symbols-outlined">flag</span>
              {{ driver.nationality }}
            </span>
            <span class="driver-hero__meta-pill">
              <span class="material-symbols-outlined">groups</span>
              {{ driver.team }}
            </span>
            <span class="driver-hero__meta-pill">
              <span class="material-symbols-outlined">confirmation_number</span>
              #{{ driver.number }}
            </span>
            <span class="driver-hero__meta-pill">
              <span class="material-symbols-outlined">calendar_month</span>
              Seasons: {{ seasons }}
            </span>
          </div>
          <p class="driver-hero__bio">
            {{ profileSummary }}
          </p>
          <div class="driver-hero__tags">
            <span class="driver-hero__tag" v-for="trait in profileTraits" :key="trait">
              <span class="material-symbols-outlined">bolt</span>
              {{ trait }}
            </span>
          </div>
          <div class="driver-hero__pills">
            <div class="driver-hero__pill">
              <p class="pill-label">World Titles</p>
              <p class="pill-value">{{ careerTitles }}</p>
            </div>
            <div class="driver-hero__pill">
              <p class="pill-label">Grand Prix Wins</p>
              <p class="pill-value">{{ careerWins }}</p>
            </div>
            <div class="driver-hero__pill">
              <p class="pill-label">Podiums</p>
              <p class="pill-value">{{ careerPodiums || '—' }}</p>
            </div>
            <div class="driver-hero__pill">
              <p class="pill-label">Race Starts</p>
              <p class="pill-value">{{ careerStarts || '—' }}</p>
            </div>
          </div>
        </div>
        <div class="driver-hero__visual">
          <div class="driver-hero__badge">
            <span>{{ driver.code }}</span>
          </div>
          <div class="driver-hero__portrait">
            <img v-if="driver.image" :src="driver.image" :alt="driver.firstName + ' ' + driver.lastName" />
            <div v-else class="driver-hero__placeholder">
              {{ driverInitials }}
            </div>
          </div>
          <div class="driver-hero__glow"></div>
          <div class="driver-hero__data">
            <div class="driver-hero__data-item">
              <p class="data-label">赛季积分</p>
              <p class="data-value">{{ seasonPoints }}</p>
            </div>
            <div class="driver-hero__data-item">
              <p class="data-label">赛季胜场</p>
              <p class="data-value">{{ seasonWins }}</p>
            </div>
            <div class="driver-hero__data-item">
              <p class="data-label">杆位</p>
              <p class="data-value">{{ seasonPoles }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="driver-panels">
      <article class="panel panel--bio">
        <header class="panel__header">
          <h2>
            <span class="material-symbols-outlined">fingerprint</span>
            Personal dossier
          </h2>
          <span class="panel__tag">Identity + contract</span>
        </header>
        <div class="panel__body panel__body--grid">
          <div class="panel__field">
            <p class="panel__label">Birth</p>
            <p class="panel__value">{{ birthPlace }} · {{ birthDate }}</p>
          </div>
          <div class="panel__field">
            <p class="panel__label">Debut</p>
            <p class="panel__value">{{ debutText }}</p>
          </div>
          <div class="panel__field">
            <p class="panel__label">First Win</p>
            <p class="panel__value">{{ firstWinText }}</p>
          </div>
          <div class="panel__field">
            <p class="panel__label">License</p>
            <p class="panel__value">{{ licenseStatus }}</p>
          </div>
          <div class="panel__field panel__field--full">
            <p class="panel__label">Career Summary</p>
            <p class="panel__value panel__value--muted">
              {{ profileSummary }}
            </p>
          </div>
        </div>
        <div class="panel__chips">
          <span class="chip" v-for="badge in profileBadges" :key="badge.label">
            <span class="chip__label">{{ badge.label }}</span>
            <span class="chip__value">{{ badge.value }}</span>
          </span>
        </div>
      </article>

      <article class="panel panel--stats">
        <header class="panel__header">
          <h2>
            <span class="material-symbols-outlined">query_stats</span>
            Trophy metrics
          </h2>
          <span class="panel__tag">Titles, wins, poles</span>
        </header>
        <div class="panel__body panel__body--stats">
          <div v-for="stat in statBlocks" :key="stat.label" class="stat-card">
            <div class="stat-card__ring">
              <svg viewBox="0 0 120 120">
                <circle class="stat-card__track" cx="60" cy="60" r="52"></circle>
                <circle class="stat-card__progress" cx="60" cy="60" r="52" :stroke-dasharray="ringCircumference"
                  :stroke-dashoffset="ringOffset(stat.progress)"></circle>
              </svg>
              <span class="stat-card__value">{{ stat.value }}</span>
            </div>
            <p class="stat-card__label">{{ stat.label }}</p>
            <p class="stat-card__note">{{ stat.caption }}</p>
          </div>
        </div>
      </article>

      <article class="panel panel--timeline">
        <header class="panel__header">
          <h2>
            <span class="material-symbols-outlined">route</span>
            Career timeline
          </h2>
          <span class="panel__tag">Key chapters</span>
        </header>
        <div class="timeline">
          <div v-for="item in timelineItems" :key="item.year + item.title" class="timeline__item">
            <div class="timeline__dot"></div>
            <div class="timeline__meta">
              <p class="timeline__year">{{ item.year }}</p>
              <p class="timeline__title">{{ item.title }}</p>
              <p class="timeline__desc">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </article>

      <article class="panel panel--wins">
        <header class="panel__header">
          <h2>
            <span class="material-symbols-outlined">emoji_events</span>
            Season form
          </h2>
          <span class="panel__tag">Season vs career</span>
        </header>
        <div class="wins-grid">
          <div v-for="item in seasonHighlights" :key="item.label" class="win-card">
            <div class="win-card__meta">
              <p class="win-card__title">{{ item.label }}</p>
              <p class="win-card__year">{{ item.value }}/{{ item.total }}</p>
            </div>
            <p class="win-card__note">{{ item.note }}</p>
            <div class="win-card__bar">
              <span class="win-card__fill" :style="{ width: item.percent + '%' }"></span>
            </div>
            <div class="win-card__footer">
              <span class="win-card__tag">Season</span>
              <span class="win-card__gap">{{ item.percentLabel }}</span>
            </div>
          </div>
        </div>
      </article>

      <article class="panel panel--ratings">
        <header class="panel__header">
          <h2>
            <span class="material-symbols-outlined">insights</span>
            Pace radar
          </h2>
          <span class="panel__tag">Quali vs race trim</span>
        </header>
        <div class="ratings-grid">
          <div v-for="rating in ratingBlocks" :key="rating.label" class="rating-card">
            <div class="rating-card__head">
              <span class="rating-card__label">{{ rating.label }}</span>
              <span class="rating-card__value">{{ rating.score }}</span>
            </div>
            <div class="rating-card__bar">
              <span class="rating-card__fill" :style="{ width: rating.score + '%' }"></span>
            </div>
            <p class="rating-card__hint">{{ rating.hint }}</p>
          </div>
        </div>
      </article>
    </section>
  </main>
  <div v-else class="driver-detail driver-detail--empty">
    <p>Driver not found.</p>
    <RouterLink class="driver-hero__back" to="/drivers">
      <span class="material-symbols-outlined">arrow_back</span>
      Back to roster
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import type { RootState, Driver, DriverProfile } from '../store'

type TimelineItem = { year: string; title: string; description: string }
type SeasonHighlight = { label: string; value: number; total: number; note: string; percent: number; percentLabel: string }
type StatBlock = { label: string; value: string | number; progress: number; caption: string }
type Badge = { label: string; value: string | number }

const route = useRoute()
const store = useStore<RootState>()

const driver = computed<Driver | null>(() => {
  const id = route.params.id as string
  return store.state.drivers.find((d) => d.id === id) ?? null
})

const seasons = computed(() => {
  if (!driver.value) return 0
  const currentYear = new Date().getFullYear()
  return Math.max(1, currentYear - driver.value.startYear + 1)
})

const driverInitials = computed(() => {
  if (!driver.value) return ''
  return `${driver.value.firstName[0]}${driver.value.lastName[0]}`
})

const themeVars = computed(() => ({
  '--accent': driver.value?.accent ?? '#00f3ff',
  '--accent-soft': driver.value?.accentSoft ?? 'rgba(0,243,255,0.15)',
  '--accent-glow': driver.value?.accentGlow ?? 'rgba(0,243,255,0.45)',
}))

const driverProfile = computed<DriverProfile | null>(() => store.state.driverProfiles[driver.value?.id ?? ''] ?? null)

const seasonStats = computed(() => driverProfile.value?.season ?? {})
const careerStats = computed(() => driverProfile.value?.career ?? {})

const parseNumber = (value?: string | number): number => {
  if (typeof value === 'number') return value
  if (!value) return 0
  const match = value.match(/-?\d+(\.\d+)?/)
  return match ? Number(match[0]) : 0
}

const parseWinsFromHighestFinish = (value?: string): number => {
  if (!value) return 0
  const match = value.match(/1\s*\(x(\d+)\)/)
  if (match?.[1]) return Number(match[1])
  return value.trim().startsWith('1') ? 1 : 0
}

const seasonRaces = computed(() => parseNumber(seasonStats.value['Grand Prix Races']))
const seasonWins = computed(() => parseNumber(seasonStats.value['Grand Prix Wins']))
const seasonPodiums = computed(() => parseNumber(seasonStats.value['Grand Prix Podiums']))
const seasonPoles = computed(() => parseNumber(seasonStats.value['Grand Prix Poles']))
const seasonTop10s = computed(() => parseNumber(seasonStats.value['Grand Prix Top 10s']))
const seasonPoints = computed(() => seasonStats.value['Season Points'] ?? '—')
const seasonPosition = computed(() => seasonStats.value['Season Position'] ?? '—')
const seasonDnfs = computed(() => parseNumber(seasonStats.value['DNFs']))
const seasonFastestLaps = computed(() => parseNumber(seasonStats.value['DHL Fastest Laps']))

const careerStarts = computed(() => parseNumber(careerStats.value['Grand Prix Entered']))
const careerPodiums = computed(() => parseNumber(careerStats.value['Podiums']))
const careerPoles = computed(() => parseNumber(careerStats.value['Pole Positions']))
const careerTitles = computed(() => parseNumber(careerStats.value['World Championships']))
const careerPoints = computed(() => careerStats.value['Career Points'] ?? '—')
const highestFinish = computed(() => careerStats.value['Highest Race Finish'] ?? '—')
const careerWins = computed(() => parseWinsFromHighestFinish(careerStats.value['Highest Race Finish']))
const careerDnfs = computed(() => parseNumber(careerStats.value['DNFs']))

const birthDate = computed(() => driverProfile.value?.bio.birthDate ?? '—')
const birthPlace = computed(() => driverProfile.value?.bio.birthPlace ?? driver.value?.nationality ?? '—')

const profileSummary = computed(() => {
  if (!driver.value) return ''
  const parts = []
  if (seasonPosition.value !== '—') parts.push(`Season ${seasonPosition.value} • ${seasonPoints.value} pts`)
  parts.push(`Career ${careerTitles.value} titles, ${careerWins.value} wins, ${careerPodiums.value} podiums, ${careerPoles.value} poles`)
  parts.push(`${careerStarts.value} GP starts • Highest finish ${highestFinish.value}`)
  return parts.join(' · ')
})

const profileTraits = computed(() => {
  const traits = new Set<string>()
  if (careerTitles.value >= 4) traits.add('Era leader')
  else if (careerTitles.value > 0) traits.add('World Champion')
  else traits.add('Future contender')
  if (careerWins.value > 0) traits.add('Race winner')
  if (careerPoles.value >= 20) traits.add('Qualifying ace')
  if (careerPodiums.value >= 50) traits.add('Consistency')
  if (seasonTop10s.value > 0 && seasonRaces.value) traits.add('Points finisher')
  traits.add(driver.value?.team ?? 'Team')
  return Array.from(traits)
})

const licenseStatus = computed(() => (driver.value?.status === 'active' ? 'Super license · Active' : 'Retired'))

const debutText = computed(() => (driver.value ? `${driver.value.startYear} season debut` : '—'))

const firstWinText = computed(() => {
  if (careerWins.value === 0) return 'Chasing maiden win'
  return highestFinish.value.startsWith('1') ? highestFinish.value : 'Race winner'
})

const profileBadges = computed<Badge[]>(() => [
  { label: 'Career points', value: careerPoints.value },
  { label: 'Season position', value: seasonPosition.value },
  { label: 'Season points', value: seasonPoints.value },
  { label: 'DNFs', value: `S:${seasonDnfs.value} · C:${careerDnfs.value}` },
])

const statBlocks = computed<StatBlock[]>(() => [
  {
    label: 'World Championships',
    value: careerTitles.value,
    progress: Math.min(100, careerTitles.value * 12),
    caption: 'Season titles secured',
  },
  {
    label: 'Grand Prix Wins',
    value: careerWins.value,
    progress: Math.min(100, careerWins.value * 1.2),
    caption: highestFinish.value,
  },
  {
    label: 'Podiums',
    value: careerPodiums.value,
    progress: Math.min(100, careerPodiums.value * 0.9),
    caption: 'Top three finishes',
  },
  {
    label: 'Pole Positions',
    value: careerPoles.value,
    progress: Math.min(100, careerPoles.value * 2),
    caption: 'Front-row starts',
  },
  {
    label: 'Grand Prix Starts',
    value: careerStarts.value,
    progress: Math.min(100, careerStarts.value * 0.4),
    caption: 'Official entries',
  },
])

const clampScore = (value: number) => Math.max(0, Math.min(100, Math.round(value)))

const ratingBlocks = computed(() => {
  const races = Math.max(1, seasonRaces.value || 1)
  return [
    { label: 'Win rate', score: clampScore((seasonWins.value / races) * 100), hint: `${seasonWins.value} wins / ${races} GPs` },
    { label: 'Podium rate', score: clampScore((seasonPodiums.value / races) * 100), hint: `${seasonPodiums.value} podiums this season` },
    { label: 'Pole rate', score: clampScore((seasonPoles.value / races) * 100), hint: `${seasonPoles.value} poles in quali` },
    {
      label: 'Finish rate',
      score: clampScore(((races - seasonDnfs.value) / races) * 100),
      hint: `${seasonDnfs.value} DNFs · ${seasonFastestLaps.value} fastest laps`,
    },
  ]
})

const seasonHighlights = computed<SeasonHighlight[]>(() => {
  const races = Math.max(1, seasonRaces.value || 1)
  const pct = (value: number) => clampScore((value / races) * 100)
  return [
    {
      label: 'Wins',
      value: seasonWins.value,
      total: races,
      note: `Career wins: ${careerWins.value}`,
      percent: pct(seasonWins.value),
      percentLabel: `${pct(seasonWins.value)}% win rate`,
    },
    {
      label: 'Podiums',
      value: seasonPodiums.value,
      total: races,
      note: `Career podiums: ${careerPodiums.value}`,
      percent: pct(seasonPodiums.value),
      percentLabel: `${pct(seasonPodiums.value)}% podiums`,
    },
    {
      label: 'Poles',
      value: seasonPoles.value,
      total: races,
      note: `Career poles: ${careerPoles.value}`,
      percent: pct(seasonPoles.value),
      percentLabel: `${pct(seasonPoles.value)}% poles`,
    },
    {
      label: 'Top 10s',
      value: seasonTop10s.value,
      total: races,
      note: `Finishes: ${races - seasonDnfs.value}/${races}`,
      percent: pct(seasonTop10s.value),
      percentLabel: `${pct(seasonTop10s.value)}% points finishes`,
    },
  ]
})

const timelineItems = computed<TimelineItem[]>(() => {
  if (!driver.value) return []
  const items: TimelineItem[] = [
    { year: `${driver.value.startYear}`, title: 'F1 debut', description: `${driver.value.team} · ${driver.value.nationality}` },
  ]
  if (careerTitles.value > 0) {
    items.push({
      year: 'Titles',
      title: `${careerTitles.value}× World Champion`,
      description: `${careerWins.value} wins · ${careerPoles.value} poles`,
    })
  }
  items.push({
    year: 'Career best',
    title: highestFinish.value,
    description: `${careerPodiums.value} podiums · ${careerStarts.value} starts`,
  })
  items.push({
    year: 'Current',
    title: `${seasonPosition.value} in standings`,
    description: `${seasonPoints.value} pts · ${seasonWins.value} wins · ${seasonPoles.value} poles`,
  })
  return items
})

const ringCircumference = 2 * Math.PI * 52
const ringOffset = (progress: number) => ringCircumference * (1 - Math.min(100, Math.max(0, progress)) / 100)
</script>

<style scoped lang="scss">
.driver-detail {
  --surface: #0a0c12;
  --panel: #0f121a;
  --border: rgba(255, 255, 255, 0.08);
  --text-muted: #9ca3af;
  min-height: 100vh;
  padding: 28px 22px 60px;
  background: radial-gradient(circle at 20% 20%, rgba(0, 243, 255, 0.04), transparent 45%),
    radial-gradient(circle at 80% 40%, rgba(255, 0, 60, 0.04), transparent 45%),
    linear-gradient(140deg, #050507 0%, #090b12 50%, #050507 100%);
  color: #fff;
}

.driver-detail--empty {
  display: grid;
  place-items: center;
  min-height: 60vh;
  gap: 12px;
}

.driver-hero {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 28px 26px;
  background: linear-gradient(100deg, color-mix(in srgb, var(--accent) 40%, #0b0e14) 0%, rgba(0, 0, 0, 0.75) 70%),
    radial-gradient(circle at 18% 35%, var(--accent-soft), transparent 50%),
    radial-gradient(circle at 82% 40%, rgba(255, 255, 255, 0.08), transparent 45%);
  isolation: isolate;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 520px;
  box-shadow: 0 24px 40px rgba(0, 0, 0, 0.38);
}

.driver-hero__bg {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0 1px, transparent 1px 100%),
    repeating-linear-gradient(135deg, rgba(0, 0, 0, 0.16) 0 14px, transparent 14px 38px);
  opacity: 0.25;
  z-index: 0;
}

.driver-hero__grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 110px 110px;
  opacity: 0.05;
}

.driver-hero__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(50px);
  opacity: 0.6;
}

.driver-hero__orb--accent {
  width: 240px;
  height: 240px;
  top: -40px;
  right: -40px;
  background: var(--accent);
  opacity: 0.2;
}

.driver-hero__orb--soft {
  width: 180px;
  height: 180px;
  bottom: -40px;
  left: -20px;
  background: var(--accent-soft);
}

.driver-hero__nav {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
}

.driver-hero__back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #fff;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.driver-hero__back:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
}

.driver-hero__content {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 26px;
  align-items: center;
}

.driver-hero__info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: flex-start;
  text-align: left;
  padding-left: 8%;
}

.driver-hero__eyebrow {
  margin: 0;
  font-family: var(--font-tech);
  letter-spacing: 0.18em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.driver-hero__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(36px, 6vw, 72px);
  letter-spacing: 0.08em;
  line-height: 1;
  text-transform: uppercase;
  color: #fff;
}

.driver-hero__title strong {
  display: block;
  color: var(--accent);
  text-shadow: 0 0 18px var(--accent-glow);
  letter-spacing: 0.04em;
}

.driver-hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.driver-hero__meta-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #e5e7eb;
}

.driver-hero__bio {
  margin: 0;
  max-width: 700px;
  color: #e5e7eb;
  line-height: 1.5;
  font-size: 15px;
}

.driver-hero__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.driver-hero__tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.driver-hero__pills {
  display: flex;
  align-items: center;
  gap: 10px;
}

.driver-hero__pill {
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(6px);
}

.pill-label {
  margin: 0;
  color: var(--text-muted);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.pill-value {
  margin: 4px 0 0;
  font-family: var(--font-display);
  font-size: 24px;
  color: #fff;
}

.driver-hero__visual {
  position: relative;
  display: grid;
  place-items: center;
  align-self: center;
  justify-self: end;
  width: min(440px, 92%);
}

.driver-hero__badge {
  position: absolute;
  top: 16px;
  right: 20px;
  padding: 6px 10px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-family: var(--font-display);
  letter-spacing: 0.16em;
}

.driver-hero__portrait {
  position: relative;
  width: 100%;
  max-height: 620px;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(0, 0, 0, 0.4)), #0b1018;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 18px 32px rgba(0, 0, 0, 0.4), 0 0 20px var(--accent-soft);
  isolation: isolate;
  padding: 0;
  backdrop-filter: blur(4px);
  z-index: 1;
}

.driver-hero__portrait img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center bottom;
  transform: none;
  filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.45));
}

.driver-hero__placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-size: 48px;
  letter-spacing: 0.2em;
  color: #e5e7eb;
  background: radial-gradient(circle at 50% 30%, var(--accent-soft), rgba(0, 0, 0, 0.8));
}

.driver-hero__glow {
  position: absolute;
  inset: 12px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  box-shadow: 0 0 24px var(--accent-glow);
  pointer-events: none;
}

.driver-hero__data {
  position: absolute;
  bottom: 12px;
  left: 6%;
  right: 6%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  backdrop-filter: blur(8px);
  z-index: 2;
}

.driver-hero__data-item {
  text-align: center;
}

.data-label {
  margin: 0;
  color: var(--text-muted);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.data-value {
  margin: 4px 0 0;
  font-family: var(--font-display);
  font-size: 20px;
  color: #fff;
}

.driver-panels {
  margin: 24px auto 0;
  display: grid;
  gap: 18px;
  max-width: 1400px;
}

.panel {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px 16px 18px;
  position: relative;
  overflow: hidden;
}

.panel::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.02), transparent 50%);
  pointer-events: none;
}

.panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.panel__header h2 {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-display);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-size: 15px;
}

.panel__tag {
  padding: 6px 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.panel__body--grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
}

.panel__field {
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.panel__field--full {
  grid-column: 1 / -1;
}

.panel__label {
  margin: 0;
  color: var(--text-muted);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.panel__value {
  margin: 4px 0 0;
  font-size: 15px;
}

.panel__value--muted {
  color: #e5e7eb;
  line-height: 1.6;
}

.panel__chips {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.chip__value {
  color: var(--accent);
  text-shadow: 0 0 10px var(--accent-glow);
}

.panel--stats .panel__body {
  padding: 6px 0 2px;
}

.panel__body--stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.stat-card {
  padding: 12px 10px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: grid;
  justify-items: center;
  gap: 8px;
}

.stat-card__ring {
  position: relative;
  width: 110px;
  height: 110px;
}

.stat-card__track {
  fill: none;
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 8;
}

.stat-card__progress {
  fill: none;
  stroke: var(--accent);
  stroke-width: 8;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  filter: drop-shadow(0 0 10px var(--accent-glow));
  transition: stroke-dashoffset 0.8s ease;
}

.stat-card__value {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-size: 24px;
}

.stat-card__label {
  margin: 0;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 12px;
}

.stat-card__note {
  margin: 0;
  color: var(--text-muted);
  font-size: 12px;
  text-align: center;
}

.timeline {
  display: grid;
  gap: 12px;
  position: relative;
  padding-left: 14px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, var(--accent), transparent);
  opacity: 0.7;
}

.timeline__item {
  position: relative;
  padding-left: 18px;
}

.timeline__dot {
  position: absolute;
  left: -2px;
  top: 6px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 12px var(--accent-glow);
}

.timeline__year {
  margin: 0;
  font-family: var(--font-display);
  letter-spacing: 0.1em;
  color: var(--accent);
  text-transform: uppercase;
}

.timeline__title {
  margin: 2px 0 0;
  font-size: 17px;
  font-weight: 700;
}

.timeline__desc {
  margin: 4px 0 0;
  color: var(--text-muted);
  line-height: 1.6;
}

.wins-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.win-card {
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: grid;
  gap: 8px;
}

.win-card__meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.win-card__title {
  margin: 0;
  font-family: var(--font-display);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.win-card__year {
  margin: 0;
  color: var(--accent);
  font-weight: 700;
}

.win-card__note {
  margin: 0;
  color: #e5e7eb;
  line-height: 1.5;
}

.win-card__bar {
  position: relative;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.win-card__fill {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent), #fff);
  box-shadow: 0 0 14px var(--accent-glow);
}

.win-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--text-muted);
  font-size: 12px;
}

.win-card__tag {
  padding: 4px 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.ratings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.rating-card {
  padding: 12px;
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0.3));
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: grid;
  gap: 6px;
}

.rating-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rating-card__label {
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 12px;
}

.rating-card__value {
  font-family: var(--font-display);
  font-size: 22px;
  color: var(--accent);
}

.rating-card__bar {
  position: relative;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.rating-card__fill {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent), #fff);
  box-shadow: 0 0 12px var(--accent-glow);
}

.rating-card__hint {
  margin: 0;
  color: var(--text-muted);
  font-size: 12px;
}

@media (max-width: 1024px) {
  .driver-detail {
    padding: 18px 14px 40px;
  }

  .driver-hero__content {
    grid-template-columns: 1fr;
  }

  .driver-hero__visual {
    order: -1;
    justify-self: center;
    width: min(360px, 100%);
  }

  .driver-hero__data {
    position: static;
  }
}

@media (max-width: 640px) {
  .driver-hero {
    padding: 16px;
  }

  .driver-hero__meta-pill {
    width: 100%;
  }

  .driver-hero__pills {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .driver-hero__data {
    position: static;
    border-radius: 14px;
    margin-top: 12px;
    left: 0;
    right: 0;
  }
}
</style>
