<template>
  <main class="track-page">
    <div class="track-layout">
      <section class="track-hero f1-reveal" style="--reveal-delay: 50ms">
        <div class="track-hero__bg"></div>
        <div class="track-hero__inner">
          <div class="track-hero__copy">
            <p class="track-hero__eyebrow">{{ $t('tracks.eyebrow') }}</p>
            <h1 class="track-hero__title">{{ $t('tracks.title') }}</h1>
            <p class="track-hero__subtitle">{{ $t('tracks.subtitle') }}</p>
            <div class="track-hero__filters">
              <input
                v-model="query"
                class="track-hero__input"
                type="text"
                :placeholder="$t('tracks.search')"
              />
              <div class="track-hero__chips">
                <F1Button
                  v-for="region in regions"
                  :key="region.value"
                  size="sm"
                  :variant="selectedRegion === region.value ? 'solid' : 'ghost'"
                  :accent="'var(--neon-blue)'"
                  :accentGlow="'rgba(0,243,255,0.4)'"
                  @click="selectedRegion = region.value"
                >
                  {{ region.label }}
                </F1Button>
              </div>
            </div>
          </div>

          <div class="track-hero__meta">
            <div class="track-meta__card">
              <p class="meta-label">{{ $t('tracks.total') }}</p>
              <p class="meta-value">{{ tracks.length }}</p>
            </div>
            <div class="track-meta__card">
              <p class="meta-label">{{ $t('tracks.mapped') }}</p>
              <p class="meta-value">2025</p>
            </div>
            <div class="track-meta__card">
              <p class="meta-label">{{ $t('tracks.filter') }}</p>
              <p class="meta-value">{{ activeRegionLabel }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="track-overview f1-reveal" style="--reveal-delay: 90ms">
        <article class="track-overview__item">
          <span class="track-overview__label">{{ $t('tracks.total') }}</span>
          <strong class="track-overview__value">{{ filteredTracks.length }}</strong>
          <span class="track-overview__meta">{{ activeRegionLabel }}</span>
        </article>
        <article class="track-overview__item">
          <span class="track-overview__label">{{ $t('tracks.lengthLabel') }}</span>
          <strong class="track-overview__value">{{ averageLengthText }}</strong>
          <span class="track-overview__meta">{{ $t('tracks.kmUnit') }}</span>
        </article>
        <article class="track-overview__item">
          <span class="track-overview__label">{{ $t('tracks.filter') }}</span>
          <strong class="track-overview__value">{{ activeRegionLabel }}</strong>
          <span class="track-overview__meta">{{ longestTrack?.name ?? '--' }}</span>
        </article>
      </section>

      <section v-if="filteredTracks.length" class="track-grid">
        <article
          v-for="(track, idx) in filteredTracks"
          :key="track.id"
          class="track-card f1-reveal"
          :style="{ '--reveal-delay': `${130 + idx * 24}ms` }"
        >
          <div class="track-card__bg"></div>
          <div class="track-card__info">
            <p class="track-card__eyebrow">{{ track.flag }} {{ track.country }}</p>
            <h2 class="track-card__title">{{ track.name }}</h2>
            <p class="track-card__meta">{{ track.location }}</p>
            <p class="track-card__length">
              {{ $t('tracks.lengthLabel') }} · {{ track.lengthKm.toFixed(3) }} {{ $t('tracks.kmUnit') }}
            </p>
            <p class="track-card__tagline">{{ track.tagline }}</p>
            <p class="track-card__desc">{{ track.description }}</p>
          </div>
          <div class="track-card__map">
            <img :src="track.image" :alt="track.name + ' track map'" loading="lazy" @click="openPreview(track)" />
          </div>
        </article>
      </section>

      <section v-else class="track-empty f1-surface f1-reveal" style="--reveal-delay: 140ms">
        <span class="material-symbols-outlined">travel_explore</span>
        <p>{{ $t('tracks.subtitle') }}</p>
        <F1Button size="sm" variant="ghost" :accent="'var(--neon-blue)'" @click="resetFilters">
          {{ $t('drivers.filterAll') }}
        </F1Button>
      </section>
    </div>

    <transition name="fade">
      <div v-if="preview" class="track-preview" @click="closePreview">
        <div class="track-preview__inner" @click.stop>
          <button class="track-preview__close" type="button" :aria-label="$t('tracks.closePreview')" @click="closePreview">
            <span class="material-symbols-outlined">close</span>
          </button>
          <img :src="preview.src" :alt="preview.title" />
          <p class="track-preview__title">{{ preview.title }}</p>
        </div>
      </div>
    </transition>
  </main>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import type { RootState, Track } from '../store'
import F1Button from '../components/F1Button.vue'

const store = useStore<RootState>()

const query = ref('')
const selectedRegion = ref<string>('all')
const preview = ref<{ src: string; title: string } | null>(null)

const regions = [
  { label: 'All', value: 'all' },
  { label: 'Europe', value: 'Europe' },
  { label: 'Americas', value: 'Americas' },
  { label: 'Middle East', value: 'Middle East' },
  { label: 'Asia-Pacific', value: 'Asia-Pacific' },
]

const regionMap: Record<string, string[]> = {
  Europe: ['UK', 'Belgium', 'Spain', 'Italy', 'Monaco', 'Austria', 'Netherlands', 'Hungary'],
  Americas: ['USA', 'Canada', 'Mexico', 'Brazil'],
  'Middle East': ['Bahrain', 'Saudi Arabia', 'Qatar', 'UAE'],
  'Asia-Pacific': ['Australia', 'China', 'Japan', 'Singapore'],
}

const tracks = computed<Track[]>(() => store.state.tracks)

const filteredTracks = computed(() => {
  const q = query.value.trim().toLowerCase()
  const region = selectedRegion.value
  return tracks.value.filter((track) => {
    const matchQuery =
      !q ||
      track.name.toLowerCase().includes(q) ||
      track.location.toLowerCase().includes(q) ||
      track.country.toLowerCase().includes(q)
    const matchRegion =
      region === 'all' ||
      regionMap[region]?.some((country) =>
        track.country.toLowerCase().includes(country.toLowerCase())
      )
    return matchQuery && matchRegion
  })
})

const activeRegionLabel = computed(
  () => regions.find((region) => region.value === selectedRegion.value)?.label ?? 'All'
)

const averageLengthText = computed(() => {
  if (!filteredTracks.value.length) return '--'
  const total = filteredTracks.value.reduce((sum, track) => sum + track.lengthKm, 0)
  return `${(total / filteredTracks.value.length).toFixed(3)}`
})

const longestTrack = computed(() => {
  if (!filteredTracks.value.length) return null
  return [...filteredTracks.value].sort((a, b) => b.lengthKm - a.lengthKm)[0] ?? null
})

const resetFilters = () => {
  query.value = ''
  selectedRegion.value = 'all'
}

const openPreview = (track: Track) => {
  preview.value = { src: track.image, title: track.name }
}

const closePreview = () => {
  preview.value = null
}

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closePreview()
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
})
</script>

<style scoped lang="scss">
.track-page {
  min-height: 100vh;
  padding: 24px 16px 40px;
  background: radial-gradient(circle at 20% 30%, rgba(0, 243, 255, 0.04), transparent 45%),
    radial-gradient(circle at 80% 70%, rgba(239, 26, 45, 0.04), transparent 45%), #05060c;
  color: #e5e7eb;
}

.track-layout {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  gap: 16px;
}

.track-hero {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.04), rgba(0, 0, 0, 0.65));
  padding: 22px 20px;
}

.track-hero__bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(0, 243, 255, 0.2), transparent 40%),
    radial-gradient(circle at 80% 40%, rgba(239, 26, 45, 0.12), transparent 42%),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0 1px, transparent 1px 28px);
  opacity: 0.35;
}

.track-hero__inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 18px;
  align-items: center;
}

.track-hero__copy {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.track-hero__eyebrow {
  margin: 0;
  font-family: var(--font-tech);
  letter-spacing: 0.2em;
  color: #9ca3af;
  text-transform: uppercase;
}

.track-hero__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 64px);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.track-hero__subtitle {
  margin: 0;
  color: #cbd5e1;
  max-width: 720px;
}

.track-hero__filters {
  display: grid;
  gap: 10px;
  align-items: center;
}

.track-hero__input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.35);
  color: #e5e7eb;
}

.track-hero__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.track-hero__meta {
  display: grid;
  gap: 8px;
}

.track-meta__card {
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.meta-label {
  margin: 0;
  color: #9ca3af;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 11px;
}

.meta-value {
  margin: 4px 0 0;
  font-family: var(--font-display);
  font-size: 22px;
}

.track-overview {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.track-overview__item {
  border-radius: 12px;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.015));
  display: grid;
  gap: 8px;
}

.track-overview__label {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #9ca3af;
  font-family: var(--font-tech);
}

.track-overview__value {
  font-size: clamp(24px, 3vw, 30px);
  line-height: 1;
  font-family: var(--font-display);
}

.track-overview__meta {
  font-family: var(--font-tech);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #aeb4be;
}

.track-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

.track-card {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(0, 0, 0, 0.6));
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  min-height: 260px;
  gap: 10px;
  transition: transform 0.24s ease, border-color 0.24s ease;
}

.track-card:hover {
  transform: translateY(-3px);
  border-color: rgba(0, 243, 255, 0.24);
}

.track-card__bg {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.04) 0 1px, transparent 1px 30px);
  opacity: 0.25;
}

.track-card__info {
  padding: 16px;
  display: grid;
  gap: 6px;
  z-index: 1;
}

.track-card__eyebrow {
  margin: 0;
  color: #9ca3af;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 11px;
}

.track-card__title {
  margin: 0;
  font-family: var(--font-display);
  letter-spacing: 0.04em;
}

.track-card__meta,
.track-card__length,
.track-card__tagline,
.track-card__desc {
  margin: 0;
  color: #cbd5e1;
}

.track-card__length {
  font-weight: 700;
}

.track-card__map {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  padding: 14px;
  cursor: zoom-in;
}

.track-card__map img {
  width: 100%;
  max-height: 320px;
  object-fit: contain;
  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.6));
}

.track-empty {
  display: grid;
  justify-items: center;
  gap: 10px;
  padding: 24px;
  text-align: center;
}

.track-empty .material-symbols-outlined {
  color: var(--neon-blue);
  font-size: 28px;
}

.track-empty p {
  margin: 0;
  color: #cad0da;
  max-width: 680px;
  line-height: 1.6;
}

.track-preview {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.track-preview__inner {
  position: relative;
  background: #0b0e14;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 18px;
  max-width: 90vw;
  max-height: 90vh;
  display: grid;
  gap: 10px;
}

.track-preview__inner img {
  max-width: 80vw;
  max-height: 70vh;
  object-fit: contain;
}

.track-preview__title {
  margin: 0;
  text-align: center;
  font-family: var(--font-display);
  letter-spacing: 0.08em;
}

.track-preview__close {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #fff;
  border-radius: 8px;
  padding: 6px;
  cursor: pointer;
}

@media (max-width: 980px) {
  .track-hero__inner {
    grid-template-columns: 1fr;
  }

  .track-overview {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .track-card {
    grid-template-columns: 1fr;
  }

  .track-card__map img {
    max-height: 260px;
  }
}

@media (max-width: 640px) {
  .track-page {
    padding: 18px 12px 30px;
  }

  .track-hero {
    padding: 16px 14px;
    border-radius: 14px;
  }

  .track-overview {
    grid-template-columns: 1fr;
  }

  .meta-value {
    font-size: 20px;
  }
}
</style>
