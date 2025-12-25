<template>
  <div class="lottery-page">
    <div class="lottery-card">
      <div class="lottery-header">
        <div class="title">Lucky Gift Draw</div>
        <div class="subtitle">10 🎁 spinning · 1 opens with weighted score</div>
      </div>

      <div class="actions">
        <button class="f-btn" type="button" @click="shuffle">
          <span class="material-symbols-outlined">shuffle</span>
          <span>Shuffle Gifts</span>
        </button>
        <button class="f-btn primary" type="button" :disabled="revealing" @click="reveal">
          <span class="material-symbols-outlined">celebration</span>
          <span>{{ revealing ? 'Revealing…' : 'Open One Gift' }}</span>
        </button>
      </div>

      <div class="grid" :class="gridClasses">
        <div
          v-for="(gift, idx) in gifts"
          :key="gift.id"
          class="gift"
          :class="{ open: gift.open, active: idx === activeIndex }"
          :style="{
            transitionDelay: `${idx * 35}ms`,
            '--idx': idx,
            '--col': idx % 5,
            '--row': Math.floor(idx / 5),
          }"
        >
          <div class="gift-inner">
            <div class="gift-emoji">🎁</div>
            <div v-if="gift.open" class="gift-score">+{{ gift.score }}</div>
            <div v-if="gift.open" class="burst" />
            <div v-if="gift.open" class="explosion"></div>
          </div>
        </div>
      </div>

      <div class="result" v-if="lastScore">
        <div class="result-chip">
          <span class="material-symbols-outlined">emoji_events</span>
          <span>You earned {{ lastScore }} points</span>
        </div>
      </div>
    </div>

    <div v-if="showFireworks" class="fireworks">
      <span
        v-for="(s, idx) in sparks"
        :key="idx"
        class="spark"
        :style="{
          '--ox': `${s.ox}%`,
          '--oy': `${s.oy}%`,
          '--dx': `${s.dx}px`,
          '--dy': `${s.dy}px`,
          '--hue': s.h,
          '--delay': `${idx * 20}ms`,
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type Gift = { id: number; score: number | null; open: boolean }
type Spark = { ox: number; oy: number; dx: number; dy: number; h: number }

const gifts = ref<Gift[]>(createGifts())
const revealing = ref(false)
const lastScore = ref<number | null>(null)
const showFireworks = ref(false)
const sparks = ref<Spark[]>(createSparks())
const activeIndex = ref(-1)
const isGathering = ref(false)
const isDealing = ref(false)
let spinTimer: ReturnType<typeof setInterval> | null = null

const gridClasses = computed(() => ({
  gather: isGathering.value,
  deal: isDealing.value,
}))

function createGifts() {
  return Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    score: null,
    open: false,
  }))
}

function createSparks(bursts = 8, perBurst = 10) {
  const sparks: Spark[] = []
  const edgePos = () => {
    const side = Math.floor(Math.random() * 4)
    if (side === 0) return { ox: 8, oy: 15 + Math.random() * 70 } // left
    if (side === 1) return { ox: 92, oy: 15 + Math.random() * 70 } // right
    if (side === 2) return { ox: 15 + Math.random() * 70, oy: 8 } // top
    return { ox: 15 + Math.random() * 70, oy: 92 } // bottom
  }

  for (let i = 0; i < bursts; i++) {
    const origin = edgePos()
    for (let j = 0; j < perBurst; j++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 180 + Math.random() * 260
      sparks.push({
        ox: origin.ox,
        oy: origin.oy,
        dx: Math.cos(angle) * radius,
        dy: Math.sin(angle) * radius,
        h: Math.floor(Math.random() * 360),
      })
    }
  }
  return sparks
}

function weightedScore() {
  const r = Math.random()
  // 1-5: 15% each (unchanged)
  if (r < 0.75) return Math.floor(r / 0.15) + 1

  // 6-10: 8%, 6%, 5%, 4%, 2% (decreasing)
  const remaining = r - 0.75
  if (remaining < 0.08) return 6
  if (remaining < 0.08 + 0.06) return 7
  if (remaining < 0.08 + 0.06 + 0.05) return 8
  if (remaining < 0.08 + 0.06 + 0.05 + 0.04) return 9
  return 10
}

function shuffle() {
  lastScore.value = null
  revealing.value = false
  showFireworks.value = false
  activeIndex.value = -1
  isGathering.value = true
  isDealing.value = false

  setTimeout(() => {
    // re-order gifts
    gifts.value = [...createGifts()].sort(() => Math.random() - 0.5)
    isDealing.value = true
    setTimeout(() => {
      isDealing.value = false
      isGathering.value = false
    }, 900)
  }, 350)
}

function reveal() {
  if (revealing.value) return
  revealing.value = true
  showFireworks.value = false
  lastScore.value = null
  // clear previous round state immediately
  gifts.value = gifts.value.map((g) => ({ ...g, open: false, score: null }))
  activeIndex.value = 0

  const targetIndex = Math.floor(Math.random() * gifts.value.length)
  const score = weightedScore()

  spinTimer && clearInterval(spinTimer)
  spinTimer = setInterval(() => {
    const len = gifts.value.length
    activeIndex.value = Math.floor(Math.random() * len)
  }, 120)

  setTimeout(() => {
    spinTimer && clearInterval(spinTimer)
    activeIndex.value = targetIndex % gifts.value.length
    gifts.value = gifts.value.map((g, idx) => ({
      ...g,
      open: idx === targetIndex,
      score: idx === targetIndex ? score : null,
    }))
    lastScore.value = score
    sparks.value = createSparks(10, 12)
    showFireworks.value = true
    setTimeout(() => (showFireworks.value = false), 2500)
    revealing.value = false
  }, 2000)
}
</script>

<style scoped>
.lottery-page {
  min-height: 100vh;
  background: radial-gradient(circle at 20% 20%, #0c1d2f, #050910 60%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 16px;
  position: relative;
  overflow: hidden;
}

.lottery-card {
  width: min(1080px, 96vw);
  background: rgba(10, 15, 25, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 20px 80px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(12px);
  color: #e8f1ff;
  padding: 50px;
}

.lottery-header .title {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 1px;
}

.lottery-header .subtitle {
  margin-top: 6px;
  color: #8ca3c0;
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 12px;
  margin: 18px 0;
  flex-wrap: wrap;
}

.f-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #e8f1ff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.f-btn.primary {
  background: linear-gradient(135deg, #ffb347, #ff6b6b);
  border: none;
  color: #0c0d12;
  font-weight: 700;
  box-shadow: 0 12px 30px rgba(255, 107, 107, 0.35);
}

.f-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.f-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}

.grid {
  margin: 24px auto 0;
  position: relative;
  --cols: 5;
  --rows: 2;
  --gap: 18px;
  --size: clamp(110px, 14vw, 160px);
  --area-w: calc(var(--cols) * var(--size) + (var(--cols) - 1) * var(--gap));
  --area-h: calc(var(--rows) * var(--size) + (var(--rows) - 1) * var(--gap));
  --center-x: calc((var(--area-w) - var(--size)) / 2);
  --center-y: calc((var(--area-h) - var(--size)) / 2);
  width: var(--area-w);
  height: var(--area-h);
}

.gift {
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 0.35s ease, opacity 0.35s ease, filter 0.35s ease;
  z-index: 1;
}

.grid.gather .gift {
  transform: translate(var(--center-x), var(--center-y)) scale(0.2) rotate(-6deg);
  opacity: 0.95;
  filter: blur(0.5px);
}

.grid.deal .gift {
  animation: deal 0.8s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  animation-delay: calc(var(--idx, 0) * 80ms);
  animation-fill-mode: forwards;
}

.gift {
  aspect-ratio: 1 / 1;
  width: var(--size);
  background: radial-gradient(circle at 30% 30%, #132033, #0c1320 70%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  position: absolute;
  overflow: hidden;
  opacity: 1;
  transform-origin: center;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
}

.grid:not(.gather):not(.deal) .gift {
  transform: translate(
      calc(var(--col, 0) * (var(--size) + var(--gap))),
      calc(var(--row, 0) * (var(--size) + var(--gap)))
    );
}

@keyframes deal {
  from {
    opacity: 0;
    transform: translate(var(--center-x), var(--center-y)) scale(0.2) rotate(-6deg);
  }
  to {
    opacity: 1;
    transform: translate(
        calc(var(--col, 0) * (var(--size) + var(--gap))),
        calc(var(--row, 0) * (var(--size) + var(--gap)))
      )
      scale(1)
      rotate(0deg);
  }
}

.gift-inner {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  z-index: 1;
}

.gift-emoji {
  font-size: 62px;
  filter: drop-shadow(0 10px 16px rgba(0, 0, 0, 0.35));
  transition: transform 0.3s ease;
}

.gift-score {
  position: relative;
  font-size: 26px;
  font-weight: 800;
  color: #ffe6a7;
  text-shadow: 0 0 12px rgba(255, 230, 167, 0.8);
  animation: pulse 0.8s ease-in-out infinite alternate;
}

@keyframes pulse {
  to {
    transform: scale(1.08);
  }
}

.burst {
  position: absolute;
  width: 120%;
  height: 120%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 220, 150, 0.3) 0%, rgba(255, 220, 150, 0) 55%);
  animation: burst 0.6s ease-out forwards;
  pointer-events: none;
}

@keyframes burst {
  from {
    transform: scale(0.6);
    opacity: 0.6;
  }
  to {
    transform: scale(1.1);
    opacity: 0;
  }
}

.explosion {
  position: absolute;
  width: 180%;
  height: 180%;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    rgba(255, 205, 120, 0.8),
    rgba(255, 150, 80, 0.6),
    rgba(255, 220, 150, 0.1),
    transparent
  );
  mask: radial-gradient(circle, rgba(0, 0, 0, 1) 40%, transparent 65%);
  animation: explode 0.7s ease-out forwards;
  pointer-events: none;
}

@keyframes explode {
  from {
    transform: scale(0.4) rotate(0deg);
    opacity: 0.9;
  }
  to {
    transform: scale(1.2) rotate(120deg);
    opacity: 0;
  }
}

.result {
  margin-top: 18px;
  display: flex;
  justify-content: center;
}

.result-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffe6a7;
  font-weight: 700;
}

.gift.active {
  box-shadow: 0 0 0 2px rgba(255, 190, 120, 0.4), 0 14px 28px rgba(255, 170, 90, 0.25);
  background: radial-gradient(circle at 50% 40%, rgba(255, 215, 160, 0.2), rgba(15, 24, 40, 0.7));
}

.gift.active::before {
  content: '';
  position: absolute;
  inset: -12%;
  background: conic-gradient(from 0deg, rgba(255, 225, 160, 0.15), rgba(255, 180, 120, 0.05), transparent 40%, rgba(255, 225, 160, 0.15));
  animation: spin 1.4s linear infinite;
  filter: blur(4px);
  z-index: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.gift.active .gift-emoji {
  transform: scale(1.08) rotate(-6deg);
}

.gift.open .gift-emoji {
  transform: scale(1.15);
}

.fireworks {
  pointer-events: none;
  position: fixed;
  inset: 0;
  overflow: hidden;
  z-index: 4;
}

.spark {
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: hsl(var(--hue, 45), 90%, 65%);
  top: var(--oy, 50%);
  left: var(--ox, 50%);
  animation: spark 1.4s ease-out forwards;
  animation-delay: var(--delay, 0ms);
  mix-blend-mode: screen;
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.35));
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.3);
}

@keyframes spark {
  0% {
    transform: translate(0, 0) scale(0.6);
    opacity: 1;
  }
  60% {
    opacity: 0.95;
  }
  to {
    transform: translate(var(--dx), var(--dy)) scale(0);
    opacity: 0;
  }
}
</style>
