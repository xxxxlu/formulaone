<template>
  <main class="teams-page">
    <div class="teams-layout">
      <section class="teams-hero f1-reveal" style="--reveal-delay: 50ms">
        <div class="teams-breadcrumb">
          <RouterLink class="teams-crumb-link" to="/home">
            <span class="material-symbols-outlined">grid_view</span>
            {{ $t('teams.breadcrumbRoot') }}
          </RouterLink>
          <span class="teams-crumb-sep">/</span>
          <span class="teams-crumb teams-crumb--active">{{ $t('teams.breadcrumbActive') }}</span>
        </div>

        <div class="teams-hero__content">
          <div class="teams-hero__text">
            <div class="teams-hero__pulse"></div>
            <h1>{{ $t('teams.title') }}</h1>
            <p>{{ $t('teams.subtitle') }}</p>
          </div>
          <div class="teams-hero__stat">
            <span class="material-symbols-outlined">dns</span>
            <div>
              <span class="teams-hero__stat-label">{{ $t('teams.active') }}</span>
              <span class="teams-hero__stat-value">{{ filteredTeams.length }}</span>
            </div>
          </div>
        </div>

        <div class="teams-actions">
          <div class="teams-search">
            <span class="material-symbols-outlined">search</span>
            <input v-model="query" :placeholder="$t('teams.search')" />
          </div>
          <div class="teams-filters">
            <F1Select v-model="season" :options="seasonOptions" />
            <F1Select v-model="sortKey" :options="sortOptions" />
          </div>
        </div>
      </section>

      <section class="teams-overview f1-reveal" style="--reveal-delay: 90ms">
        <article v-for="item in overviewItems" :key="item.label" class="teams-overview__item">
          <span class="teams-overview__label">{{ item.label }}</span>
          <strong class="teams-overview__value">{{ item.value }}</strong>
          <span class="teams-overview__meta">{{ item.meta }}</span>
        </article>
      </section>

      <section v-if="filteredTeams.length" class="teams-grid">
        <RouterLink
          v-for="(team, idx) in filteredTeams"
          :key="team.id"
          class="team-card f1-reveal"
          :style="{ ...cardStyle(team), '--reveal-delay': `${130 + idx * 28}ms` }"
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
                <span>{{ $t('teams.statEstablished') }}</span>
                <strong>{{ team.established }}</strong>
              </div>
              <div class="team-card__stat">
                <span>{{ $t('teams.statTitles') }}</span>
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
              {{ $t('teams.btnProfile') }}
              <span class="material-symbols-outlined">chevron_right</span>
            </F1Button>
          </div>
        </RouterLink>
      </section>

      <section v-else class="teams-empty f1-surface f1-reveal" style="--reveal-delay: 160ms">
        <span class="material-symbols-outlined">garage_home</span>
        <p>{{ $t('teams.subtitle') }}</p>
        <F1Button size="sm" variant="ghost" :accent="'var(--primary)'" @click="resetFilters">
          {{ $t('drivers.filterAll') }}
        </F1Button>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import F1Button from '../components/F1Button.vue'
import F1Select from '../components/F1Select.vue'
import type { RootState, Team } from '../store'

type SortKey = 'rank' | 'titles' | 'name'

const store = useStore<RootState>()
const { t } = useI18n()

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
  const unique = new Set(teams.value.map((team) => team.season))
  return Array.from(unique).sort((a, b) => b.localeCompare(a))
})

const season = ref<string>('')
const query = ref('')
const sortKey = ref<SortKey>('rank')

watch(
  seasons,
  (values) => {
    if (!values.length) {
      season.value = ''
      return
    }
    if (!values.includes(season.value)) {
      season.value = values[0] ?? ''
    }
  },
  { immediate: true }
)

const seasonTeams = computed(() => {
  const currentSeason = season.value
  return teams.value.filter((team) => !currentSeason || team.season === currentSeason)
})

const seasonOptions = computed(() =>
  seasons.value.map((value) => ({
    label: `${t('teams.season')} ${value}`,
    value,
  }))
)

const sortOptions = computed(() => [
  { label: t('teams.sortRank'), value: 'rank' },
  { label: t('teams.sortTitles'), value: 'titles' },
  { label: t('teams.sortName'), value: 'name' },
])

const filteredTeams = computed(() => {
  const q = query.value.trim().toLowerCase()
  const sorted = [...seasonTeams.value].sort((a, b) => {
    if (sortKey.value === 'rank') return a.rank - b.rank
    if (sortKey.value === 'titles') return b.titles - a.titles
    return a.name.localeCompare(b.name)
  })
  if (!q) return sorted
  return sorted.filter(
    (team) => team.name.toLowerCase().includes(q) || team.base.toLowerCase().includes(q)
  )
})

const topTeam = computed(() => [...seasonTeams.value].sort((a, b) => a.rank - b.rank)[0] ?? null)
const averageEstablished = computed(() => {
  if (!seasonTeams.value.length) return '--'
  const total = seasonTeams.value.reduce((sum, team) => sum + team.established, 0)
  return String(Math.round(total / seasonTeams.value.length))
})
const titledTeamCount = computed(() => seasonTeams.value.filter((team) => team.titles > 0).length)

const overviewItems = computed(() => [
  {
    label: t('teams.active'),
    value: seasonTeams.value.length,
    meta: `${t('teams.season')} ${season.value || '--'}`,
  },
  {
    label: t('teams.sortTitles'),
    value: titledTeamCount.value,
    meta: t('teams.statTitles'),
  },
  {
    label: t('teams.statEstablished'),
    value: averageEstablished.value,
    meta: topTeam.value?.base ?? '--',
  },
  {
    label: t('teams.sortRank'),
    value: topTeam.value ? `#${topTeam.value.rank}` : '--',
    meta: topTeam.value?.name ?? '--',
  },
])

const resetFilters = () => {
  query.value = ''
  sortKey.value = 'rank'
  season.value = seasons.value[0] ?? ''
}

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

.teams-layout {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.teams-hero {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.teams-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-tech);
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
}

.teams-crumb-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.teams-crumb-link:hover {
  color: #fff;
}

.teams-crumb-link .material-symbols-outlined {
  font-size: 15px;
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

.teams-overview {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.teams-overview__item {
  padding: 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
  display: grid;
  gap: 8px;
}

.teams-overview__label {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
  font-family: var(--font-tech);
}

.teams-overview__value {
  font-size: clamp(22px, 2.8vw, 30px);
  line-height: 1;
  font-family: var(--font-display);
  color: #fff;
}

.teams-overview__meta {
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #aeb4be;
  font-family: var(--font-tech);
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
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
  text-decoration: none;
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
  gap: 12px;
}

.team-card__name {
  margin: 0;
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: color 0.2s ease;
  color: #fff;
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

.teams-empty {
  display: grid;
  justify-items: center;
  gap: 10px;
  padding: 26px;
  text-align: center;
}

.teams-empty .material-symbols-outlined {
  font-size: 28px;
  color: var(--primary);
}

.teams-empty p {
  margin: 0;
  max-width: 540px;
  color: #c4cad4;
  line-height: 1.6;
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

@media (max-width: 1200px) {
  .teams-page {
    padding: 32px 22px 52px;
  }

  .teams-overview {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .teams-grid {
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 900px) {
  .teams-page {
    padding: 26px 18px 44px;
  }

  .teams-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .teams-search {
    min-width: 0;
    width: 100%;
  }

  .teams-filters {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .teams-page {
    padding: 20px 14px 36px;
  }

  .teams-hero {
    gap: 14px;
    padding-bottom: 14px;
  }

  .teams-hero__text h1 {
    font-size: clamp(34px, 11vw, 44px);
  }

  .teams-overview {
    grid-template-columns: 1fr;
  }

  .teams-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .team-card__media {
    height: 200px;
  }

  .team-card__stats {
    grid-template-columns: 1fr;
  }
}
</style>
