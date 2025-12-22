<template>
  <div class="f1-standings f1-card">
    <div class="f1-standings__header">
      <h3>2025 Driver Standings</h3>
      <a href="https://www.formula1.com/en/results/2025/drivers" target="_blank" rel="noreferrer">formula1.com</a>
    </div>
    <div class="f1-standings__list f1-standings__list--scroll">
      <div
        v-for="driver in standings"
        :key="driver.driver"
        class="f1-standings__item"
        :style="{ '--standings-accent': driver.accent || 'var(--neon-blue)' }"
      >
        <span class="f1-standings__rank">{{ driver.position.toString().padStart(2, '0') }}</span>
        <span class="f1-standings__avatar" :style="{ background: driver.accent ? driver.accent + '30' : 'rgba(255,255,255,0.08)' }">
          <img v-if="driver.avatar" :src="driver.avatar" :alt="driver.driver" loading="lazy" />
        </span>
        <div class="f1-standings__details">
          <div class="f1-standings__row">
            <span class="f1-standings__name">{{ driver.driver }}</span>
            <strong>{{ driver.points }}</strong>
          </div>
          <div class="f1-standings__sub">{{ driver.team }}</div>
          <div class="f1-standings__bar">
            <span :style="{ width: barWidth(driver.points) }"></span>
          </div>
        </div>
        <span class="f1-standings__teamlogo" v-if="driver.teamLogo">
          <img :src="driver.teamLogo" :alt="driver.team" loading="lazy" />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StandingDisplay } from './types'

const props = defineProps<{
  standings: StandingDisplay[]
  maxPoints: number
}>()

const barWidth = (points: number) => `${Math.round((points / Math.max(props.maxPoints, 1)) * 100)}%`
</script>

<style scoped lang="scss">
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
  gap: 12px;
}

.f1-standings__list--scroll {
  max-height: 420px;
  overflow-y: auto;
  padding: 6px 6px 10px;
}

.f1-standings__item {
  position: relative;
  display: grid;
  grid-template-columns: 48px 46px minmax(0, 1fr) 40px;
  gap: 10px;
  align-items: center;
  padding: 12px 14px;
  min-height: 80px;
  border-radius: 12px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.05));
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: visible;
}

.f1-standings__item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, var(--standings-accent, var(--neon-blue)), transparent);
  opacity: 0.22;
  transition: transform 0.2s ease;
  transform: scaleY(0);
  transform-origin: bottom;
}

.f1-standings__item:hover::before {
  transform: scaleY(1);
}

.f1-standings__rank {
  font-family: var(--font-display);
  font-size: 22px;
  color: #4b5563;
}

.f1-standings__avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.f1-standings__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  display: block;
}

.f1-standings__details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
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

.f1-standings__name {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.02em;
}

.f1-standings__sub {
  font-family: var(--font-tech);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-dim);
}

.f1-standings__bar {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

.f1-standings__bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.14), var(--standings-accent, var(--neon-blue)));
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}

.f1-standings__teamlogo {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: grid;
  place-items: center;
}

.f1-standings__teamlogo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
}
</style>
