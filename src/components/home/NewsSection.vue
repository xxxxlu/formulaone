<template>
  <div class="f1-news">
    <article
      v-for="item in newsFeatured"
      :key="item.slug"
      :class="['f1-news__card', { 'f1-news__card--logo': item.hero?.includes('f1_logo_fallback') }]"
      :style="{ backgroundImage: `url(${item.hero})` }"
    >
      <div class="f1-news__tag">{{ item.tag }}</div>
      <RouterLink class="f1-news__link" :to="`/news/${item.slug}`">
        <h4>{{ item.title }}</h4>
        <div class="f1-news__meta">
          <span>{{ item.author }}</span>
          <span class="f1-news__dot"></span>
          <span>{{ formatDate(item.publishedAt) }}</span>
        </div>
        <span class="material-symbols-outlined">arrow_forward</span>
      </RouterLink>
    </article>
    <div class="f1-news__more">
      <F1Button variant="ghost" size="sm" :accent="'var(--neon-blue)'" :textColor="'#fff'" to="/news">
        {{ $t('home.moreNews') }}
      </F1Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import F1Button from '../F1Button.vue'
import type { NewsItem } from '../../store'

defineProps<{
  newsFeatured: NewsItem[]
}>()

const formatDate = (date: string) => date.replace(/-/g, '.')
</script>

<style scoped lang="scss">
.f1-news {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.f1-news__card {
  position: relative;
  aspect-ratio: 16 / 9;
  min-height: 200px;
  height: auto;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 12px;
  transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
}

.f1-news__card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.88), rgba(0, 0, 0, 0.6), transparent);
  z-index: 0;
}

.f1-news__card h4,
.f1-news__card .material-symbols-outlined,
.f1-news__card .f1-news__tag {
  position: relative;
  z-index: 1;
}

.f1-news__card h4 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 18px;
  line-height: 1.3;
}

.f1-news__card .material-symbols-outlined {
  align-self: flex-end;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.f1-news__card:hover {
  transform: translateY(-4px);
}

.f1-news__card:hover .material-symbols-outlined {
  opacity: 1;
}

.f1-news__card--logo {
  background-size: contain;
  background-position: center;
  background-color: #0b0e14;
}

.f1-news__card--logo::before {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.65), transparent);
}

.f1-news__tag {
  align-self: flex-start;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid rgba(0, 243, 255, 0.5);
  background: rgba(0, 243, 255, 0.1);
  font-family: var(--font-tech);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--neon-blue);
}

.f1-news__link {
  position: relative;
  display: grid;
  gap: 10px;
  z-index: 1;
  text-decoration: none;
  color: #fff;
}

.f1-news__more {
  display: flex;
  align-items: center;
  justify-content: center;
}

.f1-news__meta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-tech);
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--text-dim);
}

.f1-news__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--neon-blue);
  box-shadow: 0 0 8px rgba(0, 243, 255, 0.5);
}

@media (min-width: 768px) {
  .f1-news {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
