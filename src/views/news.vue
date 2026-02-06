<template>
  <div class="f1-news-page">
    <div class="f1-container f1-news-page__header f1-reveal" style="--reveal-delay: 50ms">
      <div>
        <p class="f1-news-page__eyebrow">{{ $t('news.title') }}</p>
        <h1 class="f1-news-page__title">{{ $t('news.title') }}</h1>
        <p class="f1-news-page__lead">{{ $t('news.lead') }}</p>
      </div>
      <div class="f1-news-page__filters">
        <button
          v-for="pill in pills"
          :key="pill"
          class="f1-news-page__pill"
          :class="{ 'is-active': pill === activeTag }"
          type="button"
          @click="activeTag = pill"
        >
          {{ pill === 'All' ? $t('news.filterAll') : pill }}
        </button>
      </div>
    </div>

    <div class="f1-container f1-news-page__overview f1-reveal" style="--reveal-delay: 90ms">
      <article class="f1-news-page__stat">
        <span class="f1-news-page__stat-label">{{ $t('news.title') }}</span>
        <strong class="f1-news-page__stat-value">{{ filteredNews.length }}</strong>
        <span class="f1-news-page__stat-meta">{{ activeTag === 'All' ? $t('news.filterAll') : activeTag }}</span>
      </article>
      <article class="f1-news-page__stat">
        <span class="f1-news-page__stat-label">{{ $t('news.filterTag') }}</span>
        <strong class="f1-news-page__stat-value">{{ activeTag === 'All' ? $t('news.filterAll') : activeTag }}</strong>
        <span class="f1-news-page__stat-meta">{{ pills.length - 1 }}</span>
      </article>
      <article class="f1-news-page__stat">
        <span class="f1-news-page__stat-label">{{ $t('news.more') }}</span>
        <strong class="f1-news-page__stat-value">{{ latestDateText }}</strong>
        <span class="f1-news-page__stat-meta">{{ $t('news.source') }}</span>
      </article>
    </div>

    <div v-if="filteredNews.length" class="f1-container f1-news-page__list">
      <article
        v-for="(item, idx) in filteredNews"
        :key="item.slug"
        class="f1-news-row f1-reveal"
        :style="{ '--reveal-delay': `${130 + idx * 24}ms` }"
      >
        <div class="f1-news-row__media">
          <img :src="item.hero" :alt="item.title" loading="lazy" />
          <span class="f1-news-row__tag">{{ item.tag }}</span>
        </div>
        <div class="f1-news-row__body">
          <RouterLink class="f1-news-row__title" :to="`/news/${item.slug}`">
            {{ item.title }}
          </RouterLink>
          <p class="f1-news-row__excerpt">{{ item.excerpt }}</p>
          <div class="f1-news-row__meta">
            <span>{{ item.author }}</span>
            <span class="f1-news-row__dot"></span>
            <span>{{ formatDate(item.publishedAt) }}</span>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="f1-container f1-news-page__empty f1-surface f1-reveal" style="--reveal-delay: 130ms">
      <span class="material-symbols-outlined">newspaper</span>
      <p>{{ $t('news.notfound') }}</p>
      <button class="f1-news-page__reset" type="button" @click="activeTag = 'All'">
        {{ $t('news.filterAll') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import type { NewsItem, RootState } from '../store'

const store = useStore<RootState>()
const news = computed<NewsItem[]>(() => store.state.news)

const pills = computed(() => ['All', ...new Set(news.value.map((item) => item.tag))])
const activeTag = ref('All')

const filteredNews = computed(() =>
  news.value.filter((item) => activeTag.value === 'All' || item.tag === activeTag.value)
)

const latestDateText = computed(() => {
  const pool = filteredNews.value.length ? filteredNews.value : news.value
  if (!pool.length) return '--'
  const latest = [...pool].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0]
  if (!latest) return '--'
  return formatDate(latest.publishedAt)
})

const formatDate = (date: string) => date.replace(/-/g, '.')
</script>

<style scoped lang="scss">
.f1-news-page {
  color: #fff;
  padding-bottom: 64px;
}

.f1-news-page__header {
  padding: 20px 16px 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.f1-news-page__eyebrow {
  margin: 0 0 6px;
  font-family: var(--font-tech);
  letter-spacing: 0.18em;
  color: var(--neon-blue);
  text-transform: uppercase;
}

.f1-news-page__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 36px);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.f1-news-page__lead {
  margin: 6px 0 0;
  color: var(--text-muted);
  font-family: var(--font-tech);
  letter-spacing: 0.06em;
}

.f1-news-page__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.f1-news-page__pill {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  border-radius: 999px;
  padding: 6px 12px;
  font-family: var(--font-tech);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 11px;
  transition: all 0.2s ease;
}

.f1-news-page__pill:hover {
  border-color: rgba(255, 255, 255, 0.24);
}

.f1-news-page__pill.is-active {
  border-color: rgba(0, 243, 255, 0.5);
  background: rgba(0, 243, 255, 0.1);
  box-shadow: 0 0 12px rgba(0, 243, 255, 0.25);
}

.f1-news-page__overview {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding-top: 6px;
}

.f1-news-page__stat {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(140deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01));
  padding: 14px;
  display: grid;
  gap: 8px;
}

.f1-news-page__stat-label {
  font-family: var(--font-tech);
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #9ca3af;
}

.f1-news-page__stat-value {
  font-family: var(--font-display);
  font-size: clamp(20px, 3vw, 28px);
  letter-spacing: 0.04em;
  line-height: 1;
}

.f1-news-page__stat-meta {
  font-family: var(--font-tech);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #bdc5d2;
}

.f1-news-page__list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
  gap: 16px;
  padding: 14px 0 6px;
}

.f1-news-row {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 18px;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.04));
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  min-height: 180px;
  row-gap: 12px;
  transition: transform 0.24s ease, border-color 0.24s ease;
}

.f1-news-row:hover {
  transform: translateY(-3px);
  border-color: rgba(0, 243, 255, 0.2);
}

.f1-news-row__media {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #000;
}

.f1-news-row__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.f1-news-row__tag {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 4px 8px;
  border-radius: 8px;
  background: rgba(0, 243, 255, 0.14);
  border: 1px solid rgba(0, 243, 255, 0.3);
  font-family: var(--font-tech);
  letter-spacing: 0.16em;
  color: var(--neon-blue);
  font-size: 10px;
  text-transform: uppercase;
}

.f1-news-row__body {
  display: grid;
  gap: 10px;
  align-content: center;
}

.f1-news-row__title {
  color: #fff;
  font-family: var(--font-display);
  font-size: 16px;
  line-height: 1.25;
  text-decoration: none;
}

.f1-news-row__title:hover {
  color: var(--neon-blue);
}

.f1-news-row__excerpt {
  margin: 0;
  font-family: var(--font-tech);
  font-size: 14px;
  color: #cbd5e1;
  letter-spacing: 0.02em;
}

.f1-news-row__meta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-tech);
  font-size: 11px;
  color: var(--text-dim);
  letter-spacing: 0.1em;
}

.f1-news-row__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--neon-blue);
  box-shadow: 0 0 8px rgba(0, 243, 255, 0.5);
}

.f1-news-page__empty {
  margin-top: 14px;
  padding: 24px;
  display: grid;
  justify-items: center;
  gap: 10px;
  text-align: center;
}

.f1-news-page__empty .material-symbols-outlined {
  color: var(--neon-blue);
  font-size: 28px;
}

.f1-news-page__empty p {
  margin: 0;
  color: #c7cfdb;
}

.f1-news-page__reset {
  border: 1px solid rgba(0, 243, 255, 0.45);
  background: rgba(0, 243, 255, 0.08);
  color: #fff;
  border-radius: 999px;
  padding: 6px 14px;
  font-family: var(--font-tech);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
}

@media (max-width: 900px) {
  .f1-news-page__overview {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .f1-news-page__header {
    padding: 16px 6px 8px;
  }

  .f1-news-page__overview {
    grid-template-columns: 1fr;
    padding-top: 4px;
  }

  .f1-news-row {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    gap: 12px;
    padding: 14px;
  }

  .f1-news-row__media {
    max-height: 220px;
  }
}
</style>
