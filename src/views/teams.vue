<template>
  <main class="teams-page">
    <section class="teams-hero">
      <div class="teams-breadcrumb">
        <span class="teams-crumb">Data Center</span>
        <span class="teams-crumb-sep">/</span>
        <span class="teams-crumb teams-crumb--active">Constructors</span>
      </div>
      <div class="teams-hero__content">
        <div class="teams-hero__text">
          <div class="teams-hero__pulse"></div>
          <h1>Team Grid</h1>
          <p>
            Analyze performance data, base locations, and title counts for the current F1
            constructors.
          </p>
        </div>
        <div class="teams-hero__stat">
          <span class="material-symbols-outlined">dns</span>
          <div>
            <span class="teams-hero__stat-label">Active Teams</span>
            <span class="teams-hero__stat-value">{{ teams.length }}</span>
          </div>
        </div>
      </div>
      <div class="teams-actions">
        <div class="teams-search">
          <span class="material-symbols-outlined">search</span>
          <input v-model="query" placeholder="SEARCH TEAMS..." />
        </div>
        <div class="teams-filters">
          <F1Select v-model="season" :options="seasonOptions" />
          <F1Select v-model="sortKey" :options="sortOptions" />
        </div>
      </div>
    </section>

    <section class="teams-grid">
      <RouterLink
        v-for="team in filteredTeams"
        :key="team.id"
        class="team-card"
        :style="cardStyle(team)"
        :to="`/teams/${team.id}`"
      >
        <div class="team-card__glow"></div>
        <div class="team-card__media">
          <div class="team-card__grid"></div>
          <div class="team-card__blur"></div>
          <img v-if="team.logo" class="team-card__logo" :src="team.logo" :alt="team.name + ' logo'" loading="lazy" />
          <img v-if="team.carImage" class="team-card__car" :src="team.carImage" :alt="team.name + ' car'" loading="lazy" />
          <div class="team-card__underline"></div>
        </div>
        <div class="team-card__body">
          <div class="team-card__header">
            <div>
              <p class="team-card__name">{{ team.name }}</p>
              <p class="team-card__base">{{ team.base }}</p>
            </div>
            <div class="team-card__badge">#{{ team.rank }}</div>
          </div>
          <div class="team-card__stats">
            <div class="team-card__stat">
              <span>Established</span>
              <strong>{{ team.established }}</strong>
            </div>
            <div class="team-card__stat">
              <span>Titles</span>
              <strong>{{ team.titles }}</strong>
            </div>
          </div>
          <div v-if="team.drivers?.length" class="team-card__drivers">
            <div
              v-for="driverId in team.drivers"
              :key="driverId"
              class="team-card__driver"
              :title="driverMap[driverId]?.name"
            >
              <div class="team-card__driver-img" v-if="driverMap[driverId]?.image">
                <img :src="driverMap[driverId]?.image" :alt="driverMap[driverId]?.name" loading="lazy" />
              </div>
              <div v-else class="team-card__driver-placeholder">
                {{ driverMap[driverId]?.name?.[0] ?? '?' }}
              </div>
              <div class="team-card__driver-meta">
                <span class="team-card__driver-number">#{{ driverMap[driverId]?.number }}</span>
                <span class="team-card__driver-name">{{ driverMap[driverId]?.name }}</span>
              </div>
            </div>
          </div>
          <F1Button
            class="team-card__cta"
            size="md"
            :accent="team.color"
            variant="ghost"
            type="button"
          >
            Data Profile
            <span class="material-symbols-outlined">chevron_right</span>
          </F1Button>
        </div>
      </RouterLink>

    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import F1Button from '../components/F1Button.vue'
import F1Select from '../components/F1Select.vue'
import type { RootState, Team } from '../store'

const store = useStore<RootState>()

const teams = computed(() => store.getters.teams as Team[])
const driverMap = computed(() =>
  store.state.drivers.reduce<Record<string, { name: string; number: number; image?: string }>>(
    (map, d) => {
      map[d.id] = { name: `${d.firstName} ${d.lastName}`, number: d.number, image: d.image }
      return map
    },
    {}
  )
)
const seasons = computed(() => {
  const unique = new Set(teams.value.map((t) => t.season))
  return Array.from(unique).sort((a, b) => b.localeCompare(a))
})

const season = ref<string>(seasons.value[0] ?? '')
const query = ref('')
const sortKey = ref<'rank' | 'titles' | 'name'>('rank')

const seasonOptions = computed(() =>
  seasons.value.map((value) => ({
    label: `Season ${value}`,
    value,
  }))
)

const sortOptions = [
  { label: 'Rank', value: 'rank' },
  { label: 'Titles', value: 'titles' },
  { label: 'Name (A-Z)', value: 'name' },
]

const filteredTeams = computed(() => {
  const q = query.value.trim().toLowerCase()
  const currentSeason = season.value
  const filtered = teams.value.filter((team) => !currentSeason || team.season === currentSeason)
  const sorted = [...filtered].sort((a, b) => {
    if (sortKey.value === 'rank') return a.rank - b.rank
    if (sortKey.value === 'titles') return b.titles - a.titles
    return a.name.localeCompare(b.name)
  })
  if (!q) return sorted
  return sorted.filter(
    (team) => team.name.toLowerCase().includes(q) || team.base.toLowerCase().includes(q)
  )
})

const cardStyle = (team: Team) => ({
  '--team-color': team.color,
  '--team-soft': team.colorSoft,
})
</script>

<style scoped lang="scss">
.teams-page {
  --bg: #0b0e14;
  --card: #15191e;
  --border: #2a3038;
  --text: #e5e7eb;
  --muted: #9ca3af;
  --primary: #ef1a2d;
  min-height: 100vh;
  padding: 28px 24px 48px;
  background: radial-gradient(circle at 20% 20%, rgba(239, 26, 45, 0.06), transparent 40%),
    radial-gradient(circle at 80% 60%, rgba(0, 243, 255, 0.04), transparent 45%), var(--bg);
  color: var(--text);
}

.teams-hero {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.teams-breadcrumb {
  display: flex;
  gap: 8px;
  font-family: var(--font-tech);
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
}

.teams-crumb--active {
  color: #fff;
}

.teams-hero__content {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.teams-hero__text {
  position: relative;
  max-width: 700px;
}

.teams-hero__pulse {
  position: absolute;
  left: -12px;
  top: 8px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--primary);
  box-shadow: 0 0 0 0 rgba(239, 26, 45, 0.6);
  animation: pulse 2s infinite;
}

.teams-hero__text h1 {
  margin: 0 0 8px;
  font-family: var(--font-display);
  font-size: clamp(42px, 6vw, 64px);
  font-weight: 900;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}

.teams-hero__text p {
  margin: 0;
  max-width: 720px;
  padding-left: 10px;
  border-left: 2px solid var(--primary);
  color: #9ca3af;
  line-height: 1.6;
}

.teams-hero__stat {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
}

.teams-hero__stat .material-symbols-outlined {
  color: var(--primary);
}

.teams-hero__stat-label {
  display: block;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
}

.teams-hero__stat-value {
  display: block;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 22px;
}

.teams-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.teams-search {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  min-width: 280px;
}

.teams-search input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-family: var(--font-tech);
  letter-spacing: 0.18em;
  font-size: 12px;
}

.teams-search input::placeholder {
  color: #4b5563;
}

.teams-filters {
  display: flex;
  gap: 10px;
}

.teams-grid {
  max-width: 1400px;
  margin: 24px auto 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
  gap: 20px;
}

.team-card {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  background: linear-gradient(145deg, rgba(21, 25, 30, 0.9) 0%, rgba(11, 14, 17, 0.95) 100%);
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.team-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 0 30px -6px var(--team-soft);
}

.team-card__glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, var(--team-soft), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.team-card:hover .team-card__glow {
  opacity: 1;
}

.team-card__media {
  position: relative;
  height: 220px;
  display: grid;
  place-items: center;
  background: #0e1115;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.team-card__grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.08;
}

.team-card__blur {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--team-color);
  filter: blur(60px);
  opacity: 0.18;
  transition: opacity 0.3s ease;
}

.team-card:hover .team-card__blur {
  opacity: 0.35;
}

.team-card__logo {
  position: absolute;
  top: 14px;
  left: 14px;
  height: 32px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5));
  z-index: 2;
}

.team-card__car {
  position: relative;
  z-index: 1;
  max-height: 120px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 12px 18px rgba(0, 0, 0, 0.5));
  transition: transform 0.35s ease, filter 0.35s ease;
}

.team-card:hover .team-card__car {
  transform: scale(1.05);
  filter: drop-shadow(0 16px 22px rgba(0, 0, 0, 0.65));
}

.team-card__dots {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 6px;
  opacity: 0.4;
}

.team-card__dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--team-color);
}

.team-card__underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--team-color), transparent);
  opacity: 0.5;
}

.team-card__body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.team-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.team-card__name {
  margin: 0;
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: color 0.2s ease;
}

.team-card__base {
  margin: 6px 0 0;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
}

.team-card__badge {
  padding: 6px 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-family: var(--font-tech);
  font-size: 12px;
  color: #fff;
}

.team-card__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.team-card__stat {
  padding: 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.team-card__stat span {
  display: block;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 6px;
}

.team-card__stat strong {
  font-family: var(--font-tech);
  font-size: 18px;
  color: #fff;
}

.team-card__drivers {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.team-card__driver {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 8px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.team-card__driver-img,
.team-card__driver-placeholder {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.team-card__driver-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.team-card__driver-placeholder {
  font-family: var(--font-display);
  color: #fff;
  font-weight: 800;
}

.team-card__driver-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.team-card__driver-number {
  font-family: var(--font-tech);
  font-size: 11px;
  letter-spacing: 0.16em;
  color: var(--muted);
}

.team-card__driver-name {
  font-size: 13px;
  color: #fff;
  font-weight: 700;
}

.team-card__cta {
  justify-content: center;
  margin-top: 4px;
  --f1-button-border: rgba(255, 255, 255, 0.12);
  --f1-button-text: #fff;
  --f1-button-bg: rgba(255, 255, 255, 0.04);
  --f1-button-accent: var(--team-color);
  --f1-button-accent-glow: var(--team-soft);
}

.team-card__cta .material-symbols-outlined {
  font-size: 18px;
}

.team-card:hover .team-card__name {
  color: var(--team-color);
}

.team-card--empty {
  align-items: stretch;
}

.team-card__body--empty {
  padding: 20px;
  gap: 10px;
}

.team-card__placeholder {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.5;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 26, 45, 0.6);
  }
  70% {
    box-shadow: 0 0 0 12px rgba(239, 26, 45, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 26, 45, 0);
  }
}

@media (min-width: 768px) {
  .teams-page {
    padding: 36px 36px 56px;
  }
}
</style>
