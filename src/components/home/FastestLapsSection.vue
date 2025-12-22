<template>
  <div class="f1-fastlaps f1-card">
    <div class="f1-fastlaps__header">
      <h4>2025 Fastest Laps</h4>
      <a href="https://www.formula1.com/en/results/2025/awards/fastest-laps" target="_blank" rel="noreferrer">formula1.com</a>
    </div>

    <div class="f1-fastlaps__list">
      <div v-for="lap in laps" :key="lap.round" class="f1-fastlap" :style="{ '--lap-accent': lap.accent || 'var(--neon-pink)' }">
        <div class="f1-fastlap__round">Rd {{ lap.round.toString().padStart(2, '0') }}</div>
        <span class="f1-fastlap__avatar" :style="{ background: lap.accent ? lap.accent + '30' : 'rgba(255,255,255,0.08)' }">
          <img v-if="lap.avatar" :src="lap.avatar" :alt="lap.driver" loading="lazy" />
        </span>
        <div class="f1-fastlap__body">
          <div class="f1-fastlap__gp">{{ lap.grandPrix }} GP</div>
          <div class="f1-fastlap__meta">
            <span>{{ lap.car || '—' }}</span>
          </div>
          <div class="f1-fastlap__driver">
            <span>{{ lap.driver }}</span>
            <span class="f1-fastlap__timechip">{{ lap.time }}</span>
          </div>
        </div>
        <span class="f1-fastlap__teamlogo" v-if="lap.teamLogo">
          <img :src="lap.teamLogo" :alt="lap.car" loading="lazy" />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FastestLapDisplay } from './types'

defineProps<{
  laps: FastestLapDisplay[]
}>()
</script>

<style scoped lang="scss">
.f1-fastlaps {
  padding: 16px 18px 18px;
}

.f1-fastlaps__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.f1-fastlaps__header h4 {
  margin: 0;
  font-family: var(--font-display);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 14px;
}

.f1-fastlaps__header a {
  font-family: var(--font-tech);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--neon-pink);
}

.f1-fastlaps__list {
  display: grid;
  gap: 10px;
  max-height: 420px;
  overflow-y: auto;
  padding-right: 4px;
}

.f1-fastlap {
  display: grid;
  grid-template-columns: 70px 52px minmax(0, 1fr) 52px;
  align-items: center;
  gap: 12px;
  padding: 12px 12px;
  border-radius: 10px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.05));
  border: 1px solid rgba(255, 255, 255, 0.06);
  position: relative;
  overflow: hidden;
}

.f1-fastlap::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, var(--lap-accent, var(--neon-pink)), transparent);
  opacity: 0.16;
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 0.2s ease;
}

.f1-fastlap:hover::before {
  transform: scaleY(1);
}

.f1-fastlap__round {
  font-family: var(--font-tech);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-dim);
  font-size: 11px;
}

.f1-fastlap__avatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.f1-fastlap__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 2%;
  transform: translateY(6px);
  display: block;
}

.f1-fastlap__body {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.f1-fastlap__gp {
  font-family: var(--font-display);
  font-size: 15px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.f1-fastlap__meta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-tech);
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--text-dim);
  text-transform: uppercase;
}

.f1-fastlap__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--neon-pink);
  box-shadow: 0 0 8px rgba(255, 65, 199, 0.4);
}

.f1-fastlap__driver {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-family: var(--font-display);
  font-size: 14px;
}

.f1-fastlap__timechip {
  font-family: var(--font-tech);
  letter-spacing: 0.14em;
  font-size: 11px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 6px 10px;
  border-radius: 999px;
}

.f1-fastlap__teamlogo {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: grid;
  place-items: center;
}

.f1-fastlap__teamlogo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
}
</style>
