<template>
  <Teleport to="body">
    <transition name="fade-blur">
      <div v-if="open" class="f1-track-modal" @click="$emit('close')">
        <div class="f1-track-modal__content" @click.stop>
          <div class="f1-track-modal__header">
            <div>
              <p class="f1-track-modal__eyebrow">{{ activeEvent?.name }}</p>
              <h4 class="f1-track-modal__title">{{ activeTrack?.name || 'Circuit Map' }}</h4>
              <p class="f1-track-modal__meta">
                {{ activeTrack?.location || activeEvent?.location }}
                <span v-if="activeTrack?.lengthKm"> • {{ activeTrack.lengthKm }} km</span>
              </p>
            </div>
            <F1Button variant="ghost" size="sm" transparent square type="button" aria-label="Close track preview" @click="$emit('close')">
              <span class="material-symbols-outlined">close</span>
            </F1Button>
          </div>
          <div class="f1-track-modal__body">
            <img :src="activeTrack?.image || defaultTrackImage" :alt="activeTrack?.name || 'Circuit Map'" />
            <p v-if="activeTrack" class="f1-track-modal__desc">
              {{ activeTrack.description }}
            </p>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import F1Button from '../F1Button.vue'
import type { Track } from '../../store'
import type { CountdownEventWithTs } from './types'

defineProps<{
  open: boolean
  activeTrack: Track | null
  activeEvent: CountdownEventWithTs | null
  defaultTrackImage: string
}>()

defineEmits<{
  close: []
}>()
</script>

<style scoped lang="scss">
.f1-track-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  z-index: 2000;
  padding: 24px;
}

.f1-track-modal__content {
  width: min(1080px, 100%);
  background: #0b0e14;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
  overflow: hidden;
}

.f1-track-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: linear-gradient(90deg, rgba(0, 243, 255, 0.08), transparent);
}

.f1-track-modal__eyebrow {
  margin: 0;
  font-family: var(--font-tech);
  font-size: 11px;
  letter-spacing: 0.2em;
  color: var(--neon-blue);
  text-transform: uppercase;
}

.f1-track-modal__title {
  margin: 4px 0 2px;
  font-family: var(--font-display);
  font-size: 22px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.f1-track-modal__meta {
  margin: 0;
  font-family: var(--font-tech);
  font-size: 12px;
  letter-spacing: 0.1em;
  color: var(--text-dim);
}

.f1-track-modal__body {
  padding: 16px 18px 22px;
  display: grid;
  gap: 12px;
}

.f1-track-modal__body img {
  width: 100%;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #000;
}

.f1-track-modal__desc {
  margin: 0;
  font-family: var(--font-tech);
  font-size: 13px;
  color: #e5e7eb;
  letter-spacing: 0.05em;
}

.fade-blur-enter-active,
.fade-blur-leave-active {
  transition: opacity 0.25s ease;
}

.fade-blur-enter-from,
.fade-blur-leave-to {
  opacity: 0;
}
</style>
