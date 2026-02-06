<template>
  <div class="f1-races f1-card">
    <div class="f1-races__header">
      <h4>{{ $t('home.raceResultsTitle') }}</h4>
      <a href="https://www.formula1.com/en/results/2025/races" target="_blank" rel="noreferrer">{{ $t('home.officialSite') }}</a>
    </div>
    <div class="f1-races__list">
      <div v-for="race in races" :key="race.round" class="f1-race" :style="{ '--race-accent': race.accent || 'var(--neon-blue)' }">
        <div class="f1-race__round">{{ $t('home.roundLabel', { round: race.round.toString().padStart(2, '0') }) }}</div>
        <span class="f1-race__avatar" :style="{ background: race.accent ? race.accent + '30' : 'rgba(255,255,255,0.08)' }">
          <img v-if="race.winnerAvatar" :src="race.winnerAvatar" :alt="race.winner" loading="lazy" />
        </span>
        <div class="f1-race__body">
          <div class="f1-race__gp">{{ race.grandPrix }}</div>
          <div class="f1-race__meta">
            <span>{{ race.date }}</span>
            <span class="f1-race__dot"></span>
            <span>{{ race.laps }} {{ $t('home.lapsUnit') }}</span>
          </div>
          <div class="f1-race__winner">
            <span>{{ race.winner }}</span>
            <span class="f1-race__car">{{ race.car }}</span>
          </div>
        </div>
        <div class="f1-race__time">{{ race.time }}</div>
        <span class="f1-race__teamlogo" v-if="race.teamLogo">
          <img :src="race.teamLogo" :alt="race.car" loading="lazy" />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RaceDisplay } from './types'

defineProps<{
  races: RaceDisplay[]
}>()
</script>

<style scoped lang="scss">
.f1-races {
  padding: 10px 10px 12px;
}

.f1-races__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  padding: 8px 8px 12px;
  background: linear-gradient(90deg, rgba(0, 243, 255, 0.07), rgba(255, 255, 255, 0));
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.f1-races__header h4 {
  margin: 0;
  font-family: var(--font-display);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 14px;
}

.f1-races__header a {
  font-family: var(--font-tech);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--neon-blue);
}

.f1-races__list {
  display: grid;
  gap: 10px;
  max-height: 420px;
  overflow-y: auto;
  padding: 10px 4px 6px;
}

.f1-race {
  display: grid;
  grid-template-columns: 70px 52px minmax(0, 1fr) auto 48px;
  align-items: center;
  gap: 12px;
  padding: 12px 12px;
  border-radius: 10px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.05));
  border: 1px solid rgba(255, 255, 255, 0.06);
  position: relative;
  overflow: hidden;
  transition: transform var(--duration-fast) var(--ease-standard),
    border-color var(--duration-fast) var(--ease-standard),
    box-shadow var(--duration-fast) var(--ease-standard);
}

.f1-race::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, var(--race-accent, var(--neon-blue)), transparent);
  opacity: 0.16;
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 0.2s ease;
}

.f1-race:hover::before {
  transform: scaleY(1);
}

.f1-race:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.28);
}

.f1-race__round {
  font-family: var(--font-tech);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-dim);
  font-size: 11px;
}

.f1-race__avatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.f1-race__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 2%;
  transform: translateY(6px);
  display: block;
}

.f1-race__body {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.f1-race__gp {
  font-family: var(--font-display);
  font-size: 15px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.f1-race__meta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-tech);
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--text-dim);
}

.f1-race__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--neon-blue);
  box-shadow: 0 0 8px rgba(0, 243, 255, 0.5);
}

.f1-race__winner {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  font-family: var(--font-display);
  font-size: 14px;
}

.f1-race__car {
  font-family: var(--font-tech);
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--text-dim);
  text-transform: uppercase;
}

.f1-race__time {
  font-family: var(--font-tech);
  font-size: 12px;
  letter-spacing: 0.12em;
  color: #e5e7eb;
}

.f1-race__teamlogo {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: grid;
  place-items: center;
}

.f1-race__teamlogo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
}

@media (max-width: 860px) {
  .f1-races {
    padding: 6px;
  }

  .f1-race {
    grid-template-columns: 56px 40px minmax(0, 1fr);
    gap: 8px;
  }

  .f1-race__time,
  .f1-race__teamlogo {
    display: none;
  }
}
</style>
