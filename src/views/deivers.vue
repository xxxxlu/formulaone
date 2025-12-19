<template>
  <main class="drivers-page">
    <div class="drivers-layout">
      <div class="drivers-breadcrumb">
        <a href="#">
          <span class="material-symbols-outlined">grid_view</span>
          HUB
        </a>
        <span>/</span>
        <span>Roster</span>
      </div>

      <section class="drivers-header">
        <div>
          <h1 class="drivers-title">
            <span>Grid</span> <strong>Drivers</strong>
          </h1>
          <p class="drivers-subtitle">Official roster 2024 / Historical legends database</p>
        </div>
        <div class="drivers-actions">
          <div class="drivers-status">System Online</div>
          <F1Button class="drivers-export" variant="outline" type="button">
            <span class="material-symbols-outlined">download</span>
            Extract Data
          </F1Button>
        </div>
      </section>

      <section class="drivers-filters">
        <div class="drivers-filter-group">
          <F1Button
            v-for="option in filters"
            :key="option.key"
            class="drivers-filter"
            size="sm"
            :active="activeFilter === option.key"
            type="button"
            @click="setFilter(option.key)"
          >
            <span>{{ option.label }}</span>
            <span v-if="activeFilter === option.key" class="material-symbols-outlined">check</span>
          </F1Button>
        </div>
        <div class="drivers-sort">
          <label for="driver-sort">Filter By:</label>
          <F1Select id="driver-sort" v-model="sortKey" :options="sortOptions" />
        </div>
      </section>

      <section class="drivers-grid">
        <article
          v-for="driver in pagedDrivers"
          :key="driver.id"
          class="driver-card"
          :class="{ 'driver-card--legend': driver.status === 'legend' }"
          :style="cardStyle(driver)"
        >
          <div class="driver-card__glow"></div>
          <span v-if="driver.badge" class="driver-card__badge">{{ driver.badge }}</span>
          <div class="driver-card__media">
            <div class="driver-card__texture"></div>
            <div class="driver-card__icon">
              <span class="material-symbols-outlined">{{ driver.icon }}</span>
            </div>
            <div class="driver-card__id">
              <span>ID: {{ driver.code }}</span>
              <div class="driver-card__id-bar"></div>
            </div>
            <div class="driver-card__number">{{ driver.number }}</div>
            <div class="driver-card__portrait">
              <img
                v-if="driver.image"
                :src="driver.image"
                :alt="driver.firstName + ' ' + driver.lastName"
              />
              <div v-else class="driver-card__placeholder">
                <span>{{ initials(driver) }}</span>
              </div>
            </div>
            <div class="driver-card__overlay"></div>
          </div>
          <div class="driver-card__body">
            <div class="driver-card__header">
              <div>
                <p class="driver-card__team">{{ driver.team }}</p>
                <h3 class="driver-card__name">
                  {{ driver.firstName }}<br />
                  <span>{{ driver.lastName }}</span>
                </h3>
              </div>
              <div class="driver-card__country">
                <span class="material-symbols-outlined">flag</span>
                <span>{{ driver.countryCode }}</span>
              </div>
            </div>
            <div class="driver-card__stats">
              <div class="driver-card__championships">
                <div class="driver-card__stat-row">
                  <span>World Championships</span>
                  <strong>{{ formatChampionships(driver) }}</strong>
                </div>
                <div class="driver-card__bars">
                  <span
                    v-for="slot in championshipSlots"
                    :key="slot"
                    class="driver-card__bar"
                    :class="{ 'driver-card__bar--active': slot <= driver.championships }"
                  ></span>
                </div>
              </div>
              <div class="driver-card__stat">
                <span>{{ yearsLabel(driver) }}</span>
                <span class="driver-card__value">{{ formatYears(driver) }}</span>
              </div>
              <div class="driver-card__stat driver-card__stat--status">
                <span>Status</span>
                <div
                  class="driver-card__status"
                  :class="
                    driver.status === 'legend'
                      ? 'driver-card__status--legend'
                      : 'driver-card__status--active'
                  "
                >
                  <span v-if="driver.status === 'legend'" class="material-symbols-outlined">star</span>
                  <span v-else class="driver-card__status-dot"></span>
                  <span>{{ statusLabel(driver) }}</span>
                </div>
              </div>
            </div>
          </div>
          <span class="driver-card__corner"></span>
        </article>
      </section>

      <section v-if="pageCount > 1" class="drivers-pagination">
        <div class="drivers-pagination__inner">
          <F1Button
            class="drivers-pagination__btn"
            size="sm"
            square
            type="button"
            :disabled="currentPage === 1"
            @click="previousPage"
          >
            <span class="material-symbols-outlined">chevron_left</span>
          </F1Button>
          <F1Button
            v-for="page in pages"
            :key="page"
            class="drivers-pagination__page"
            size="sm"
            square
            :active="page === currentPage"
            type="button"
            @click="goToPage(page)"
          >
            {{ page }}
          </F1Button>
          <F1Button
            class="drivers-pagination__btn"
            size="sm"
            square
            type="button"
            :disabled="currentPage === pageCount"
            @click="nextPage"
          >
            <span class="material-symbols-outlined">chevron_right</span>
          </F1Button>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import F1Button from '../components/F1Button.vue'
import F1Select from '../components/F1Select.vue'
import type { Driver, RootState } from '../store'

type FilterKey = 'all' | 'active' | 'champions' | 'legends'

type SortKey = 'championships' | 'name' | 'wins'

const filters = [
  { key: 'all', label: 'All Drivers' },
  { key: 'active', label: 'Active Grid' },
  { key: 'champions', label: 'Champions' },
  { key: 'legends', label: 'Legends' },
] as const

const sortOptions: Array<{ label: string; value: SortKey }> = [
  { label: 'Championships', value: 'championships' },
  { label: 'Name (A-Z)', value: 'name' },
  { label: 'Wins', value: 'wins' },
]

const store = useStore<RootState>()
const activeFilter = ref<FilterKey>('all')
const sortKey = ref<SortKey>('championships')
const currentPage = ref(1)
const pageSize = 12
const championshipSlots = 7

const drivers = computed(() => store.state.drivers)

const filteredDrivers = computed(() => {
  if (activeFilter.value === 'active') {
    return drivers.value.filter((driver: { status: string }) => driver.status === 'active')
  }
  if (activeFilter.value === 'champions') {
    return drivers.value.filter((driver: { championships: number }) => driver.championships > 0)
  }
  if (activeFilter.value === 'legends') {
    return drivers.value.filter((driver: { status: string }) => driver.status === 'legend')
  }
  return drivers.value
})

const sortedDrivers = computed(() => {
  const list = [...filteredDrivers.value]
  if (sortKey.value === 'name') {
    return list.sort((a, b) =>
      `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`)
    )
  }
  if (sortKey.value === 'wins') {
    return list.sort((a, b) => b.wins - a.wins)
  }
  return list.sort((a, b) => b.championships - a.championships)
})

const pageCount = computed(() => Math.max(1, Math.ceil(sortedDrivers.value.length / pageSize)))
const pages = computed(() => Array.from({ length: pageCount.value }, (_, index) => index + 1))
const pagedDrivers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return sortedDrivers.value.slice(start, start + pageSize)
})

watch(sortKey, () => {
  currentPage.value = 1
})

const setFilter = (next: FilterKey) => {
  activeFilter.value = next
  currentPage.value = 1
}

const goToPage = (page: number) => {
  currentPage.value = page
}

const previousPage = () => {
  currentPage.value = Math.max(1, currentPage.value - 1)
}

const nextPage = () => {
  currentPage.value = Math.min(pageCount.value, currentPage.value + 1)
}

const formatYears = (driver: Driver) =>
  driver.endYear ? `${driver.startYear}-${driver.endYear}` : `${driver.startYear}-PRESENT`

const yearsLabel = (driver: Driver) => (driver.status === 'legend' ? 'Career Years' : 'Active Years')

const statusLabel = (driver: Driver) => (driver.status === 'legend' ? 'Eternal' : 'Active')

const initials = (driver: Driver) => `${driver.firstName[0]}${driver.lastName[0]}`

const formatChampionships = (driver: Driver) =>
  driver.championships > 0 ? `${driver.championships}x` : '0'

const cardStyle = (driver: Driver) => ({
  '--accent': driver.accent,
  '--accent-soft': driver.accentSoft,
  '--accent-glow': driver.accentGlow,
  '--badge-color': driver.badgeColor ?? driver.accent,
  '--badge-text': driver.badgeText ?? '#000',
}) as Record<string, string>
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap');

.drivers-page {
  --drivers-bg: #0b0e14;
  --drivers-card: #151a23;
  --drivers-border: #2a3441;
  --drivers-primary: #3b82f6;
  --drivers-primary-glow: #60a5fa;
  --drivers-accent: #ef4444;
  --drivers-font-display: 'Chakra Petch', sans-serif;
  --drivers-font-body: 'Manrope', sans-serif;
  --f1-control-bg: var(--drivers-card);
  --f1-control-border: var(--drivers-border);
  --f1-control-text: #f8fafc;
  --f1-control-muted: #9ca3af;
  --f1-control-accent: var(--drivers-primary);
  --f1-control-ring: rgba(59, 130, 246, 0.2);
  --f1-control-font: var(--drivers-font-display);
  --f1-button-accent: var(--drivers-primary);
  --f1-button-accent-glow: rgba(59, 130, 246, 0.45);
  --f1-button-bg: #151a23;
  --f1-button-border: var(--drivers-border);
  --f1-button-text: #f8fafc;
  --f1-button-muted: #9ca3af;
  --f1-button-font: var(--drivers-font-display);
  min-height: 100vh;
  padding: 32px 24px 60px;
  background-color: var(--drivers-bg);
  background-image: linear-gradient(rgba(17, 25, 33, 0.9), rgba(11, 14, 20, 0.95)),
    repeating-linear-gradient(0deg, transparent, transparent 1px, #1c2530 1px, #1c2530 2px);
  background-size: 100% 100%, 100% 40px;
  color: #fff;
  font-family: var(--drivers-font-body);
}

.drivers-layout {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.drivers-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--drivers-font-display);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.drivers-breadcrumb a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  transition: color 0.2s ease;
}

.drivers-breadcrumb a:hover {
  color: var(--drivers-primary);
}

.drivers-breadcrumb span {
  color: #e2e8f0;
}

.drivers-breadcrumb .material-symbols-outlined {
  font-size: 14px;
}

.drivers-header {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-end;
  justify-content: space-between;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--drivers-border);
  position: relative;
}

.drivers-header::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 140px;
  height: 2px;
  background: var(--drivers-primary);
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.8);
}

.drivers-title {
  margin: 0;
  font-family: var(--drivers-font-display);
  font-size: clamp(40px, 6vw, 64px);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 0.9;
}

.drivers-title span {
  background: linear-gradient(90deg, #fff, #94a3b8);
  -webkit-background-clip: text;
  color: transparent;
}

.drivers-title strong {
  color: var(--drivers-primary);
}

.drivers-subtitle {
  margin: 8px 0 0;
  max-width: 520px;
  padding-left: 8px;
  border-left: 2px solid #374151;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #9ca3af;
}

.drivers-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.drivers-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-family: 'SFMono-Regular', 'Consolas', 'Liberation Mono', monospace;
  padding: 6px 10px;
  border-radius: 4px;
  background: rgba(59, 130, 246, 0.1);
  color: var(--drivers-primary);
  border: 1px solid rgba(59, 130, 246, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.drivers-status::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--drivers-primary);
  animation: pulse-slow 2s ease-in-out infinite;
}

:deep(.drivers-export) {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 4px;
  background: #151a23;
  border: 1px solid var(--drivers-border);
  color: #f8fafc;
  font-family: var(--drivers-font-display);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  cursor: pointer;
  transition: all 0.2s ease;
}

:deep(.drivers-export .material-symbols-outlined) {
  font-size: 16px;
}

:deep(.drivers-export:hover) {
  border-color: var(--drivers-primary);
  color: var(--drivers-primary);
}

.drivers-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.drivers-filter-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

:deep(.drivers-filter) {
  position: relative;
  border: 1px solid var(--drivers-border);
  background: #151a23;
  padding: 10px 18px;
  font-family: var(--drivers-font-display);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s ease;
}

:deep(.drivers-filter)::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.2), transparent 70%);
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

:deep(.drivers-filter:hover) {
  border-color: #64748b;
  color: #f8fafc;
}

:deep(.drivers-filter:hover)::after {
  opacity: 1;
}

:deep(.drivers-filter.is-active) {
  background: var(--drivers-primary);
  color: #fff;
  border-color: var(--drivers-primary);
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
}

:deep(.drivers-filter.is-active)::after {
  opacity: 0.2;
}

:deep(.drivers-filter span) {
  position: relative;
  z-index: 1;
}

:deep(.drivers-filter .material-symbols-outlined) {
  font-size: 14px;
  margin-left: 6px;
}

.drivers-sort {
  display: flex;
  align-items: center;
  gap: 10px;
}

.drivers-sort label {
  font-family: var(--drivers-font-display);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #9ca3af;
}

.drivers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.driver-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%);
  border: 1px solid rgba(255, 255, 255, 0.05);
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  --accent: var(--drivers-primary);
  --accent-soft: rgba(59, 130, 246, 0.15);
  --accent-glow: rgba(59, 130, 246, 0.4);
  --badge-color: transparent;
  --badge-text: #000;
}

.driver-card:hover {
  transform: translateY(-6px);
  border-color: var(--accent);
  box-shadow: 0 18px 30px -10px rgba(15, 23, 42, 0.8);
}

.driver-card__glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, var(--accent-soft), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.driver-card:hover .driver-card__glow {
  opacity: 1;
}

.driver-card__badge {
  position: absolute;
  top: -1px;
  left: -1px;
  z-index: 3;
  padding: 6px 14px;
  font-size: 10px;
  font-family: var(--drivers-font-display);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  background: var(--badge-color);
  color: var(--badge-text);
  transform: skewX(-12deg);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
}

.driver-card__media {
  position: relative;
  height: 300px;
  background: #0f1218;
  border-bottom: 1px solid var(--drivers-border);
  overflow: hidden;
}

.driver-card__texture {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
      45deg,
      rgba(26, 26, 26, 0.4) 25%,
      transparent 25%,
      transparent 75%,
      rgba(26, 26, 26, 0.4) 75%,
      rgba(26, 26, 26, 0.4)
    ),
    linear-gradient(
      45deg,
      rgba(26, 26, 26, 0.4) 25%,
      transparent 25%,
      transparent 75%,
      rgba(26, 26, 26, 0.4) 75%,
      rgba(26, 26, 26, 0.4)
    );
  background-position: 0 0, 4px 4px;
  background-size: 8px 8px;
  opacity: 0.35;
  z-index: 0;
}

.driver-card__icon {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: grid;
  place-items: center;
  background: rgba(6, 29, 66, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 12px var(--accent-soft);
  z-index: 2;
}

.driver-card__icon .material-symbols-outlined {
  font-size: 18px;
  color: var(--accent);
}

.driver-card__id {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
  font-family: 'SFMono-Regular', 'Consolas', 'Liberation Mono', monospace;
  font-size: 10px;
  color: var(--accent);
}

.driver-card__id-bar {
  width: 32px;
  height: 2px;
  margin-top: 4px;
  background: var(--accent);
  opacity: 0.6;
}

.driver-card__number {
  position: absolute;
  bottom: -20px;
  left: -10px;
  font-family: var(--drivers-font-display);
  font-size: 120px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.06);
  font-style: italic;
  z-index: 1;
  transition: color 0.3s ease, text-shadow 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
}

.driver-card:hover .driver-card__number {
  color: var(--accent);
  opacity: 0.22;
  text-shadow: 0 0 16px var(--accent-glow), 0 0 32px var(--accent-glow);
  transform: translateX(4px);
}

.driver-card__portrait {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  height: 260px;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  z-index: 2;
}

.driver-card__portrait img {
  height: 200%;
  width: auto;
  object-fit: cover;
  transform: translateY(55%);
  filter: drop-shadow(0 20px 20px rgba(0, 0, 0, 0.5));
  transition: transform 0.4s ease, filter 0.4s ease;
}

.driver-card--legend .driver-card__portrait img {
  filter: grayscale(1) drop-shadow(0 20px 20px rgba(0, 0, 0, 0.5));
}

.driver-card:hover .driver-card__portrait img {
  transform: translateY(55%) scale(1.03);
  filter: drop-shadow(0 25px 24px rgba(0, 0, 0, 0.6));
}

.driver-card--legend:hover .driver-card__portrait img {
  filter: grayscale(0) drop-shadow(0 25px 24px rgba(0, 0, 0, 0.6));
}

.driver-card__placeholder {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: grid;
  place-items: center;
  font-family: var(--drivers-font-display);
  font-size: 32px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
}

.driver-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, #151a23 5%, transparent 60%);
  z-index: 1;
}

.driver-card__body {
  padding: 18px 18px 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  z-index: 2;
}

.driver-card__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--drivers-border);
}

.driver-card__team {
  margin: 0 0 6px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--accent);
  font-family: var(--drivers-font-display);
}

.driver-card__name {
  margin: 0;
  font-family: var(--drivers-font-display);
  font-size: 22px;
  font-weight: 800;
  text-transform: uppercase;
  font-style: italic;
  line-height: 1.05;
}

.driver-card__name span {
  color: #94a3b8;
}

.driver-card__country {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #cbd5f5;
  font-weight: 600;
}

.driver-card__country .material-symbols-outlined {
  font-size: 16px;
  color: #64748b;
}

.driver-card__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 10px;
}

.driver-card__championships {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.driver-card__stat-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: #9ca3af;
  font-family: var(--drivers-font-display);
}

.driver-card__stat-row strong {
  font-size: 12px;
  color: var(--accent);
}

.driver-card__bars {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  height: 8px;
}

.driver-card__bar {
  border-radius: 2px;
  background: #2c3440;
}

.driver-card__bar--active {
  background: var(--accent);
  box-shadow: 0 0 6px var(--accent-glow);
}

.driver-card__stat {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: #9ca3af;
  font-family: var(--drivers-font-display);
}

.driver-card__stat--status {
  align-items: flex-end;
  text-align: right;
}

.driver-card__value {
  font-size: 12px;
  color: #f8fafc;
  font-family: 'SFMono-Regular', 'Consolas', 'Liberation Mono', monospace;
}

.driver-card__status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
}

.driver-card__status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.8);
}

.driver-card__status--active {
  color: #22c55e;
}

.driver-card__status--legend {
  color: #fbbf24;
}

.driver-card__status--legend .material-symbols-outlined {
  font-size: 12px;
}

.driver-card__corner {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 16px;
  height: 16px;
  border-right: 2px solid var(--accent-soft);
  border-bottom: 2px solid var(--accent-soft);
}

.drivers-pagination {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

.drivers-pagination__inner {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.drivers-pagination__btn),
:deep(.drivers-pagination__page) {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  border: 1px solid var(--drivers-border);
  background: #151a23;
  color: #9ca3af;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

:deep(.drivers-pagination__btn:hover),
:deep(.drivers-pagination__page:hover) {
  border-color: var(--drivers-primary);
  color: var(--drivers-primary);
}

:deep(.drivers-pagination__page.is-active) {
  background: var(--drivers-primary);
  color: #fff;
  border-color: var(--drivers-primary);
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.4);
}

:deep(.drivers-pagination__btn:disabled) {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (min-width: 768px) {
  .drivers-page {
    padding: 40px 40px 70px;
  }

  .drivers-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}

@media (min-width: 1024px) {
  .drivers-grid {
    grid-template-columns: repeat(3, minmax(260px, 1fr));
  }
}

@media (min-width: 1280px) {
  .drivers-grid {
    grid-template-columns: repeat(4, minmax(240px, 1fr));
  }
}
</style>
