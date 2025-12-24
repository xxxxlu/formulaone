<template>
  <div class="champions-page">
    <section class="champions-hero">
      <div class="f1-container champions-hero__inner">
        <div class="champions-hero__glow"></div>
        <div class="champions-hero__content">
          <p class="champions-hero__eyebrow">{{ $t('champions.title') }}</p>
          <h1 class="champions-hero__title">1950 - 2025</h1>
          <p class="champions-hero__subtitle">{{ $t('champions.subtitle') }}</p>
        </div>
      </div>
    </section>

    <section class="f1-container champions-card">
      <div class="champions-table">
        <div class="champions-table__head">
          <span>{{ $t('champions.season') }}</span>
          <span>{{ $t('champions.driver') }}</span>
          <span>{{ $t('champions.team') }}</span>
          <span>{{ $t('champions.engine') }}</span>
          <span>{{ $t('champions.tyre') }}</span>
          <span>{{ $t('champions.poles') }}</span>
          <span>{{ $t('champions.wins') }}</span>
          <span>{{ $t('champions.podiums') }}</span>
          <span>{{ $t('champions.fastest') }}</span>
          <span>{{ $t('champions.points') }}</span>
          <span>{{ $t('champions.schedule') }}</span>
          <span>{{ $t('champions.lead') }}</span>
        </div>
        <div v-for="row in champions" :key="row.season" class="champions-table__row">
          <span class="mono">{{ row.season }}</span>
          <span>
            <strong>{{ displayDriver(row) }}</strong>
            <small class="muted">{{ locale === 'zh' ? (row.driverEn || row.driver) : row.driver }}</small>
          </span>
          <span>
            <strong>{{ displayTeam(row) }}</strong>
            <small class="muted">{{ locale === 'zh' ? (row.teamEn || row.team) : row.team }}</small>
          </span>
          <span>{{ row.engine }}</span>
          <span class="mono">{{ row.tyre }}</span>
          <span class="mono">{{ row.poles }}</span>
          <span class="mono">{{ row.wins }}</span>
          <span class="mono">{{ row.podiums }}</span>
          <span class="mono">{{ row.fastestLaps }}</span>
          <span class="mono">{{ row.points }}</span>
          <span class="mono">{{ row.schedule }}</span>
          <span class="mono">{{ row.lead }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import champions from '../store/data/champions'

const { locale } = useI18n()

const displayDriver = (row: any) => (locale.value === 'zh' ? row.driver : row.driverEn || row.driver)
const displayTeam = (row: any) => (locale.value === 'zh' ? row.team : row.teamEn || row.team)
</script>

<style scoped lang="scss">
.champions-page {
  color: #e5e7eb;
  padding-bottom: 80px;
  background: radial-gradient(circle at 20% 20%, rgba(0, 243, 255, 0.06), transparent 40%),
    radial-gradient(circle at 80% 40%, rgba(255, 0, 60, 0.06), transparent 40%), #0b0e14;
}

.champions-hero {
  padding: 40px 24px 12px;
  position: relative;
  overflow: hidden;
}

.champions-hero__inner {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.champions-hero__glow {
  position: absolute;
  inset: -80px -20%;
  background: radial-gradient(circle at 20% 30%, rgba(0, 243, 255, 0.12), transparent 32%),
    radial-gradient(circle at 80% 30%, rgba(255, 0, 90, 0.12), transparent 32%),
    linear-gradient(120deg, rgba(0, 243, 255, 0.08), transparent, rgba(255, 0, 90, 0.08));
  filter: blur(20px);
  animation: slow-pan 12s ease-in-out infinite alternate;
}

.champions-hero__content {
  position: relative;
}

.champions-hero__eyebrow {
  margin: 0;
  font-family: var(--font-tech);
  letter-spacing: 0.2em;
  color: var(--neon-blue);
  text-transform: uppercase;
}

.champions-hero__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(32px, 6vw, 52px);
  letter-spacing: 0.08em;
}

.champions-hero__subtitle {
  margin: 0;
  max-width: 720px;
  color: #9ca3af;
  font-family: var(--font-tech);
  letter-spacing: 0.05em;
}

.champions-card {
  background: rgba(18, 18, 26, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
}

.champions-table {
  display: grid;
  gap: 8px;
  overflow-x: auto;
}

.champions-table__head,
.champions-table__row {
  display: grid;
  grid-template-columns: 0.8fr 1.6fr 1.8fr 1.2fr 0.7fr 0.6fr 0.7fr 0.8fr 0.9fr 0.8fr 0.8fr 0.8fr;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  min-width: 1080px;
  animation: fade-up 0.4s ease;
}

.champions-table__head {
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

.champions-table__row {
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.04));
  font-family: var(--font-tech);
  letter-spacing: 0.03em;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.champions-table__row:nth-child(odd) {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.05));
}

.champions-table__row:hover {
  transform: translateY(-2px);
  border-color: rgba(0, 243, 255, 0.25);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.champions-table__row span {
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
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(-20px, 6px, 0);
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

@media (max-width: 768px) {
  .champions-hero {
    padding: 32px 16px 8px;
  }

  .champions-card {
    padding: 12px;
  }
}
</style>
