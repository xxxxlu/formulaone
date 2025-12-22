<template>
  <div class="f1-telemetry f1-card">
    <div class="f1-telemetry__header">
      <h3>
        CIRCUIT TELEMETRY
        <span>{{ activeTrack?.name || 'V.2.0' }}</span>
      </h3>
      <F1Button
        class="f1-telemetry__action"
        variant="ghost"
        size="sm"
        square
        transparent
        type="button"
        aria-label="Expand telemetry"
        @click="$emit('openTrack')"
      >
        <span class="material-symbols-outlined">fullscreen</span>
      </F1Button>
    </div>
    <div class="f1-telemetry__map">
      <div class="f1-telemetry__grid"></div>
      <div class="f1-telemetry__glow"></div>
      <img :src="activeTrack?.image || defaultTrackImage" :alt="activeTrack?.name || 'Circuit Map'" />
      <div class="f1-telemetry__marker">
        <span class="f1-telemetry__pulse"></span>
        <span class="f1-telemetry__dot"></span>
        <span class="f1-telemetry__tooltip">SEC 1: 28.4s</span>
      </div>
    </div>
    <div v-if="activeTrack" class="f1-telemetry__tagline">
      <div>
        <span class="f1-telemetry__tag">{{ activeTrack.tagline }}</span>
        <p class="f1-telemetry__desc">{{ activeTrack.description }}</p>
      </div>
      <div class="f1-telemetry__meta">
        <span class="f1-telemetry__meta-item">
          <span class="material-symbols-outlined">straight</span>
          {{ activeTrack.lengthKm }} km
        </span>
        <span class="f1-telemetry__meta-item">
          <span class="material-symbols-outlined">flag</span>
          {{ activeTrack.location }}
        </span>
      </div>
    </div>
    <div class="f1-telemetry__metrics">
      <div class="f1-telemetry__metric">
        <span>Length</span>
        <strong>{{ activeTrack?.lengthKm || '--' }} <span>km</span></strong>
      </div>
      <div class="f1-telemetry__metric">
        <span>Lap Record</span>
        <strong class="text-glow-blue">1:21.046</strong>
      </div>
      <div class="f1-telemetry__metric">
        <span>DRS Zones</span>
        <strong>2</strong>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import F1Button from '../F1Button.vue'
import type { Track } from '../../store'

defineProps<{
  activeTrack: Track | null
  defaultTrackImage: string
}>()
</script>

<style scoped lang="scss">
.f1-telemetry {
  overflow: hidden;
}

.f1-telemetry__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.f1-telemetry__header h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 16px;
  letter-spacing: 0.1em;
}

.f1-telemetry__header h3 span {
  font-size: 10px;
  margin-left: 8px;
  color: var(--neon-blue);
}

:deep(.f1-telemetry__action) {
  --f1-button-text: var(--text-muted);
  --f1-button-text-strong: #fff;
  --f1-button-border: transparent;
  --f1-button-bg: transparent;
}

:deep(.f1-telemetry__action:hover) {
  --f1-button-text: #fff;
}

.f1-telemetry__map {
  position: relative;
  aspect-ratio: 21 / 9;
  background: #080a0f;
  padding: 28px;
  overflow: hidden;
}

.f1-telemetry__grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
}

.f1-telemetry__glow {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}

.f1-telemetry__glow::before {
  content: '';
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: rgba(0, 243, 255, 0.08);
  filter: blur(48px);
}

.f1-telemetry__map img {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0.85;
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.4));
}

.f1-telemetry__marker {
  position: absolute;
  top: 30%;
  left: 25%;
  display: flex;
  align-items: center;
  gap: 8px;
}

.f1-telemetry__pulse {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(255, 0, 60, 0.7);
  animation: ping 1.4s ease-out infinite;
  top: -4px;
  left: -4px;
}

.f1-telemetry__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--neon-red);
  position: relative;
  z-index: 1;
}

.f1-telemetry__tooltip {
  margin-left: 16px;
  padding: 6px 8px;
  background: rgba(0, 0, 0, 0.8);
  border-left: 2px solid var(--neon-red);
  font-family: var(--font-tech);
  font-size: 10px;
  color: #fff;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.f1-telemetry__map:hover .f1-telemetry__tooltip {
  opacity: 1;
}

.f1-telemetry__tagline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  margin: 12px 0 0;
  border-radius: 10px;
  background: linear-gradient(90deg, rgba(0, 243, 255, 0.08), rgba(255, 255, 255, 0));
  border: 1px solid rgba(0, 243, 255, 0.15);
  box-shadow: 0 12px 30px rgba(0, 243, 255, 0.08);
}

.f1-telemetry__tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(0, 243, 255, 0.12);
  border: 1px solid rgba(0, 243, 255, 0.25);
  font-family: var(--font-tech);
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--neon-blue);
  margin-bottom: 6px;
}

.f1-telemetry__desc {
  margin: 0;
  font-family: var(--font-tech);
  font-size: 12px;
  color: #e5e7eb;
  letter-spacing: 0.05em;
  max-width: 720px;
}

.f1-telemetry__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-family: var(--font-tech);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--text-dim);
}

.f1-telemetry__meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.f1-telemetry__meta-item .material-symbols-outlined {
  font-size: 14px;
  color: var(--neon-blue);
}

.f1-telemetry__metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
}

.f1-telemetry__metric {
  padding: 14px;
  text-align: center;
}

.f1-telemetry__metric span {
  display: block;
  font-family: var(--font-tech);
  font-size: 10px;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.f1-telemetry__metric strong {
  display: block;
  font-family: var(--font-display);
  font-size: 18px;
  margin-top: 6px;
}

.f1-telemetry__metric strong span {
  font-size: 10px;
}
</style>
