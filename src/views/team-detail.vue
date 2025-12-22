<template>
  <main v-if="team" class="team-detail" :style="themeVars">
    <section class="hero">
      <div class="hero__bg"></div>
      <div class="hero__nav">
        <router-link class="hero__back" to="/teams">
          <span class="material-symbols-outlined">arrow_back</span>
          All teams
        </router-link>
      </div>
      <div class="hero__banner">
        <div class="hero__car" v-if="team.carImage">
          <img :src="team.carImage" :alt="team.name + ' car'" />
        </div>
        <div class="hero__wordmark" v-if="team.name">
          <span class="hero__stripe hero__stripe--left"></span>
          <h1>{{ team.name }}</h1>
          <span class="hero__stripe hero__stripe--right"></span>
        </div>
        <p class="hero__drivers" v-if="team.drivers?.length">
          {{ driverNames }}
        </p>
        <p class="hero__meta">
          {{ team.base }} · Est. {{ team.established }} · Rank {{ team.rank }}
        </p>
      </div>
    </section>

    <section id="drivers" class="drivers-section">
      <div class="section-header">
        <h2>Drivers</h2>
        <span>2025 lineup</span>
      </div>
      <div class="drivers-grid">
        <article
          v-for="driverId in team.drivers"
          :key="driverId"
          class="driver-card"
          :style="driverStyle(driverId)"
        >
          <div class="driver-card__bg"></div>
          <div class="driver-card__info">
            <p class="driver-card__name">
              <span>{{ driverMap[driverId]?.name?.split(' ')[0] }}</span>
              <strong>{{ driverMap[driverId]?.name?.split(' ')[1] }}</strong>
            </p>
            <p class="driver-card__team">{{ team.name }}</p>
            <p class="driver-card__number">#{{ driverMap[driverId]?.number }}</p>
          </div>
          <div class="driver-card__portrait" v-if="driverMap[driverId]?.image">
            <img :src="driverMap[driverId]?.image" :alt="driverMap[driverId]?.name" />
          </div>
        </article>
      </div>
    </section>

    <section id="statistics" class="stats-section">
      <div class="section-header">
        <h2>Statistics</h2>
        <span>2025 Season</span>
      </div>
      <div class="stats-grid">
        <div class="stat-block">
          <p class="stat-label">Season Position</p>
          <p class="stat-value">{{ ordinal(team.rank) }}</p>
        </div>
        <div class="stat-block">
          <p class="stat-label">Season Points</p>
          <p class="stat-value">{{ team.seasonPoints ?? 'Updating' }}</p>
        </div>
        <div class="stat-block">
          <p class="stat-label">Wins</p>
          <p class="stat-value">{{ team.winsTotal ?? team.titles }}</p>
        </div>
        <div class="stat-block">
          <p class="stat-label">Pole Positions</p>
          <p class="stat-value">{{ team.polePositions ?? '—' }}</p>
        </div>
        <div class="stat-block">
          <p class="stat-label">Fastest Laps</p>
          <p class="stat-value">{{ team.fastestLaps ?? '—' }}</p>
        </div>
        <div class="stat-block">
          <p class="stat-label">Titles</p>
          <p class="stat-value">{{ team.titles }}</p>
        </div>
      </div>
    </section>

    <section id="profile" class="profile-section">
      <div class="section-header">
        <h2>Team Profile</h2>
        <span>Overview</span>
      </div>
      <div class="profile-grid">
        <div class="profile-card profile-card--wide">
          <h3>About</h3>
          <p>{{ team.about || 'Detailed information will be updated soon.' }}</p>
        </div>
        <div class="profile-card">
          <span class="profile-label">Team Chief</span>
          <strong class="profile-value">{{ team.teamChief || 'Updating' }}</strong>
        </div>
        <div class="profile-card">
          <span class="profile-label">Technical Chief</span>
          <strong class="profile-value">{{ team.technicalChief || 'Updating' }}</strong>
        </div>
        <div class="profile-card">
          <span class="profile-label">Chassis</span>
          <strong class="profile-value">{{ team.chassis || 'Updating' }}</strong>
        </div>
        <div class="profile-card">
          <span class="profile-label">Power Unit</span>
          <strong class="profile-value">{{ team.powerUnit || 'Updating' }}</strong>
        </div>
        <div class="profile-card">
          <span class="profile-label">First Entry</span>
          <strong class="profile-value">{{ team.firstEntry || 'Updating' }}</strong>
        </div>
        <div class="profile-card">
          <span class="profile-label">Highest Finish</span>
          <strong class="profile-value">{{ team.highestFinish || 'Updating' }}</strong>
        </div>
      </div>
    </section>

    <section id="news" class="news-section" v-if="relatedNews.length">
      <div class="section-header">
        <h2>Related Articles</h2>
        <span>Latest from the grid</span>
      </div>
      <div class="news-grid">
        <article v-for="item in relatedNews" :key="item.slug" class="news-card">
          <div class="news-card__thumb">
            <img :src="item.hero" :alt="item.title" loading="lazy" />
          </div>
          <div class="news-card__body">
            <p class="news-card__tag">{{ item.tag }}</p>
            <h4 class="news-card__title">
              <router-link :to="`/news/${item.slug}`">{{ item.title }}</router-link>
            </h4>
            <p class="news-card__meta">{{ item.publishedAt }}</p>
          </div>
        </article>
      </div>
    </section>
  </main>
  <div v-else class="team-detail team-detail--empty">
    <p>Team data not found.</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import type { RootState, Team, NewsItem } from '../store'

const route = useRoute()
const store = useStore<RootState>()

const team = computed<Team | null>(() => {
  const id = route.params.id as string
  return store.state.teams.find((t) => t.id === id) ?? null
})

const driverMap = computed(() =>
  store.state.drivers.reduce<
    Record<string, { name: string; number: number; image?: string; accent: string }>
  >((map, d) => {
    map[d.id] = {
      name: `${d.firstName} ${d.lastName}`,
      number: d.number,
      image: d.image,
      accent: d.accent,
    }
    return map
  }, {})
)

const driverNames = computed(() =>
  (team.value?.drivers ?? [])
    .map((id) => driverMap.value[id]?.name)
    .filter(Boolean)
    .join(' · ')
)

const themeVars = computed(() => ({
  '--team-color': team.value?.color ?? '#ef1a2d',
  '--team-soft': team.value?.colorSoft ?? 'rgba(239,26,45,0.18)',
}))

const driverStyle = (driverId: string) => ({
  '--driver-accent': driverMap.value[driverId]?.accent ?? '#ef1a2d',
})

const relatedNews = computed<NewsItem[]>(() => {
  const name = team.value?.name?.toLowerCase() ?? ''
  const tags = [team.value?.name, ...(team.value?.drivers ?? []).map((id) => driverMap.value[id]?.name)]
    .filter(Boolean)
    .map((t) => t!.toLowerCase())

  const items = store.state.news.filter(
    (n) =>
      tags.some((t) => n.title.toLowerCase().includes(t) || n.tag.toLowerCase().includes(t)) ||
      n.title.toLowerCase().includes(name)
  )
  return items.slice(0, 4)
})

const ordinal = (n: number | undefined) => {
  if (!n) return '—'
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  const suffix = s[(v - 20) % 10] ?? s[v] ?? s[0]
  return `${n}${suffix}`
}
</script>

<style scoped lang="scss">
.team-detail {
  --bg: #0b0e14;
  min-height: 100vh;
  padding: 24px 16px 56px;
  background: radial-gradient(circle at 20% 20%, var(--team-soft), transparent 45%),
    radial-gradient(circle at 80% 70%, rgba(0, 243, 255, 0.05), transparent 40%), var(--bg);
  color: #e5e7eb;
}

.hero {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, var(--team-color) 0%, rgba(0, 0, 0, 0.78) 100%);
  padding: 22px 20px 26px;
  max-width: 1400px;
  margin: 0 auto 20px;
}

.hero__bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, transparent 18%),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0 2px, transparent 2px 40px),
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.12), transparent 38%),
    radial-gradient(circle at 80% 30%, rgba(255, 255, 255, 0.1), transparent 42%),
    linear-gradient(180deg, var(--team-color) 0%, rgba(0, 0, 0, 0.85) 100%);
  opacity: 0.95;
}

.hero__nav {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.hero__back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #fff;
}

.hero__tabs {
  display: flex;
  gap: 14px;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.hero__tabs a {
  color: #cbd5e1;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.hero__tabs a:hover {
  color: #fff;
  border-color: var(--team-color);
  box-shadow: 0 0 12px var(--team-soft);
}

.hero__banner {
  position: relative;
  z-index: 2;
  display: grid;
  place-items: center;
  gap: 10px;
  text-align: center;
}

.hero__wordmark {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-family: var(--font-display);
  font-size: clamp(32px, 6vw, 64px);
  text-shadow: 0 10px 22px rgba(0, 0, 0, 0.4);
  color: #fff;
}

.hero__wordmark h1 {
  margin: 0;
  font: inherit;
}

.hero__drivers {
  margin: 0;
  color: #fff;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-size: 12px;
}

.hero__meta {
  margin: 0;
  color: #e5e7eb;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 11px;
  opacity: 0.9;
}

.hero__stripe {
  flex: 1;
  height: 4px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.8), transparent);
  max-width: 220px;
  min-width: 90px;
}

.hero__stripe--right {
  transform: scaleX(-1);
}

.hero__cta {
  margin-top: 8px;
}

.hero__car {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  margin: 6px auto 8px;
}

.hero__car img {
  width: min(100%, 980px);
  height: auto;
  filter: drop-shadow(0 18px 28px rgba(0, 0, 0, 0.7));
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10px;
  margin: 0 auto 12px;
  max-width: 1400px;
}

.section-header h2 {
  margin: 0;
  font-family: var(--font-display);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.section-header span {
  font-size: 12px;
  letter-spacing: 0.14em;
  color: #9ca3af;
}

.drivers-section,
.stats-section,
.profile-section,
.news-section {
  max-width: 1400px;
  margin: 0 auto 24px;
}

.drivers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.driver-card {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(0, 0, 0, 0.45)),
    linear-gradient(135deg, rgba(255, 255, 255, 0.02), var(--driver-accent));
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: stretch;
  min-height: 180px;
}

.driver-card__bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 30%, var(--driver-accent, #ef1a2d), transparent 50%),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.06) 0 1px, transparent 1px 32px);
  opacity: 0.35;
}

.driver-card__info {
  flex: 1;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 1;
}

.driver-card__name {
  margin: 0;
  font-size: 20px;
  font-family: var(--font-display);
  letter-spacing: 0.02em;
}

.driver-card__team {
  margin: 0;
  color: #cbd5e1;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 11px;
}

.driver-card__number {
  margin-top: auto;
  font-size: 28px;
  font-weight: 800;
}

.driver-card__portrait {
  width: 200px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1;
  overflow: hidden;
  padding: 0 8px 6px 0;
}

.driver-card__portrait img {
  width: 200px;
  height: 260px;
  object-fit: cover;
  object-position: center 0%;
  transform: translateY(10px);
  filter: drop-shadow(0 12px 16px rgba(0, 0, 0, 0.55));
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.stat-block {
  padding: 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
}

.stat-label {
  margin: 0 0 6px;
  font-size: 11px;
  letter-spacing: 0.14em;
  color: #9ca3af;
  text-transform: uppercase;
}

.stat-value {
  margin: 0;
  font-size: 22px;
  font-family: var(--font-display);
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.profile-card {
  padding: 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
}

.profile-card--wide {
  grid-column: 1 / -1;
}

.profile-label {
  display: block;
  font-size: 11px;
  letter-spacing: 0.14em;
  color: #9ca3af;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.profile-value {
  font-size: 16px;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
}

.news-card {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
}

.news-card__thumb {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #0b0e14;
}

.news-card__thumb img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
}

.news-card__body {
  padding: 12px;
}

.news-card__tag {
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #9ca3af;
  margin: 0 0 6px;
}

.news-card__title {
  margin: 0 0 6px;
}

.news-card__title a {
  color: #fff;
}

.news-card__meta {
  margin: 0;
  font-size: 12px;
  color: #9ca3af;
}

.team-detail--empty {
  padding: 40px;
  color: #e5e7eb;
}

@media (max-width: 768px) {
  .hero {
    padding: 16px;
  }
}
</style>
