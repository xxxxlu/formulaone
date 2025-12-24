<template>
  <div class="constructors-page">
    <section class="constructors-hero">
      <div class="f1-container constructors-hero__inner">
        <div class="constructors-hero__glow"></div>
        <p class="constructors-hero__eyebrow">{{ $t('constructorChampions.title') }}</p>
        <h1 class="constructors-hero__title">1958 - 2025</h1>
        <p class="constructors-hero__subtitle">{{ $t('constructorChampions.subtitle') }}</p>

        <div class="constructors-hero__stats">
          <div v-for="team in topTeams" :key="team.name" class="stat-card">
            <div class="stat-card__header">
              <span class="stat-card__eyebrow">{{ $t('constructorChampions.mostTitles') }}</span>
              <span class="stat-card__count">{{ team.count }}</span>
            </div>
            <div class="stat-card__name">{{ displayTeamName(team) }}</div>
            <div class="stat-card__meta">
              <span class="mono">{{ team.percentage }}% {{ $t('constructorChampions.totalTitles') }}</span>
              <span class="mono">1958-2025</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="f1-container constructors-card">
      <div class="constructors-table">
        <div class="constructors-table__head">
          <span>{{ $t('constructorChampions.season') }}</span>
          <span>{{ $t('constructorChampions.team') }}</span>
          <span>{{ $t('constructorChampions.engine') }}</span>
          <span>{{ $t('constructorChampions.drivers') }}</span>
          <span>{{ $t('constructorChampions.tyre') }}</span>
          <span>{{ $t('constructorChampions.poles') }}</span>
          <span>{{ $t('constructorChampions.wins') }}</span>
          <span>{{ $t('constructorChampions.podiums') }}</span>
          <span>{{ $t('constructorChampions.fastest') }}</span>
          <span>{{ $t('constructorChampions.points') }}</span>
          <span>{{ $t('constructorChampions.lead') }}</span>
        </div>
        <div v-for="row in rows" :key="row.season" class="constructors-table__row">
          <span class="mono">{{ row.season }}</span>
          <span>
            <strong>{{ displayTeam(row) }}</strong>
            <small class="muted">{{ locale === 'zh' ? row.teamEn : row.team }}</small>
          </span>
          <span>
            <strong>{{ displayEngine(row) }}</strong>
            <small class="muted">{{ locale === 'zh' ? row.engineEn : row.engine }}</small>
          </span>
          <span>{{ displayDrivers(row) }}</span>
          <span class="mono">{{ row.tyre }}</span>
          <span class="mono">{{ row.poles }}</span>
          <span class="mono">{{ row.wins }}</span>
          <span class="mono">{{ row.podiums }}</span>
          <span class="mono">{{ row.fastestLaps }}</span>
          <span class="mono">{{ row.points }}</span>
          <span class="mono">{{ row.lead }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import constructorChampions from '../store/data/constructorChampions'

const { locale } = useI18n()
const rows = computed(() => constructorChampions)

const displayTeam = (row: any) => (locale.value === 'zh' ? row.team : row.teamEn || row.team)
const displayEngine = (row: any) => (locale.value === 'zh' ? row.engine : row.engineEn || row.engine)
const displayDrivers = (row: any) => (locale.value === 'zh' ? row.drivers : row.driversEn || row.drivers)

const topTeams = computed(() => {
  const tally: Record<string, { zh: string; en: string; count: number }> = {}
  rows.value.forEach((row) => {
    const key = row.teamEn || row.team
    if (!tally[key]) {
      tally[key] = { zh: row.team, en: row.teamEn || row.team, count: 0 }
    }
    tally[key].count += 1
  })
  return Object.values(tally)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)
    .map((item) => ({
      name: item.zh,
      nameEn: item.en,
      count: item.count,
      percentage: Math.round((item.count / rows.value.length) * 1000) / 10,
    }))
})

const displayTeamName = (team: any) => (locale.value === 'zh' ? team.name : team.nameEn)
</script>

<style scoped lang="scss">
.constructors-page {
  color: #e5e7eb;
  padding-bottom: 80px;
  background: radial-gradient(circle at 20% 20%, rgba(0, 243, 255, 0.05), transparent 35%),
    radial-gradient(circle at 80% 20%, rgba(255, 140, 0, 0.05), transparent 35%), #0b0e14;
}

.constructors-hero {
  padding: 40px 24px 12px;
  position: relative;
  overflow: hidden;
}

.constructors-hero__inner {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.constructors-hero__glow {
  position: absolute;
  inset: -120px -20%;
  background: radial-gradient(circle at 20% 30%, rgba(0, 243, 255, 0.12), transparent 32%),
    radial-gradient(circle at 80% 30%, rgba(255, 140, 0, 0.12), transparent 32%),
    linear-gradient(120deg, rgba(0, 243, 255, 0.08), transparent, rgba(255, 140, 0, 0.08));
  filter: blur(26px);
  animation: slow-pan 12s ease-in-out infinite alternate;
}

.constructors-hero__eyebrow {
  margin: 0;
  font-family: var(--font-tech);
  letter-spacing: 0.2em;
  color: var(--neon-blue);
  text-transform: uppercase;
}

.constructors-hero__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(32px, 6vw, 52px);
  letter-spacing: 0.08em;
}

.constructors-hero__subtitle {
  margin: 0;
  max-width: 820px;
  color: #9ca3af;
  font-family: var(--font-tech);
  letter-spacing: 0.05em;
  line-height: 1.6;
}

.constructors-hero__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.stat-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 14px 16px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.stat-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 30%, rgba(0, 243, 255, 0.1), transparent 45%),
    radial-gradient(circle at 80% 70%, rgba(255, 140, 0, 0.08), transparent 45%);
  pointer-events: none;
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: rgba(0, 243, 255, 0.3);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.4);
}

.stat-card__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
}

.stat-card__eyebrow {
  font-family: var(--font-tech);
  letter-spacing: 0.12em;
  color: var(--neon-blue);
  text-transform: uppercase;
  font-size: 11px;
}

.stat-card__count {
  font-family: var(--font-display);
  font-size: 32px;
}

.stat-card__name {
  font-family: var(--font-display);
  font-size: 18px;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.stat-card__meta {
  display: flex;
  gap: 10px;
  color: #9ca3af;
  font-size: 12px;
  font-family: var(--font-tech);
}

.constructors-card {
  margin-top: 12px;
  background: rgba(18, 18, 26, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
}

.constructors-table {
  display: grid;
  gap: 8px;
  overflow-x: auto;
}

.constructors-table__head,
.constructors-table__row {
  display: grid;
  grid-template-columns: 0.8fr 1.6fr 1.4fr 2.4fr 0.7fr 0.7fr 0.8fr 0.9fr 0.9fr 0.8fr 0.9fr;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  min-width: 1140px;
  animation: fade-up 0.4s ease;
}

.constructors-table__head {
  font-family: var(--font-tech);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-size: 11px;
  color: var(--text-muted);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: sticky;
  top: 0;
  background: rgba(11, 14, 20, 0.9);
  backdrop-filter: blur(8px);
  z-index: 1;
}

.constructors-table__row {
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.04));
  font-family: var(--font-tech);
  letter-spacing: 0.03em;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.constructors-table__row:nth-child(odd) {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.05));
}

.constructors-table__row:hover {
  transform: translateY(-2px);
  border-color: rgba(0, 243, 255, 0.25);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.constructors-table__row span {
  display: inline-block;
}

.mono {
  font-family: 'SFMono-Regular', 'Consolas', 'Liberation Mono', monospace;
}

.muted {
  display: block;
  color: #9ca3af;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.02em;
}

@keyframes slow-pan {
  from {
    transform: translateX(-4%);
  }
  to {
    transform: translateX(6%);
  }
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
