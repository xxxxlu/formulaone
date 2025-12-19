<template>
  <div class="f1-news-page">
    <div class="f1-container f1-news-page__header">
      <div>
        <p class="f1-news-page__eyebrow">Latest</p>
        <h1 class="f1-news-page__title">F1 News</h1>
        <p class="f1-news-page__lead">官方最新报道，按标签快速筛选。</p>
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
          {{ pill }}
        </button>
      </div>
    </div>

    <div class="f1-container f1-news-page__list">
      <article
        v-for="item in filteredNews"
        :key="item.slug"
        class="f1-news-row"
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import type { RootState, NewsItem } from '../store'

const store = useStore<RootState>()
const news = computed<NewsItem[]>(() => store.state.news)

const pills = computed(() => ['All', ...new Set(news.value.map((n) => n.tag))])
const activeTag = ref('All')

const filteredNews = computed(() =>
  news.value.filter((n) => activeTag.value === 'All' || n.tag === activeTag.value)
)

const formatDate = (date: string) => date.replace(/-/g, '.')
</script>

<style scoped lang="scss">
.f1-news-page {
  color: #fff;
  padding-bottom: 64px;
}

.f1-news-page__header {
  padding: 20px 16px 12px;
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

.f1-news-page__pill.is-active {
  border-color: rgba(0, 243, 255, 0.5);
  background: rgba(0, 243, 255, 0.1);
  box-shadow: 0 0 12px rgba(0, 243, 255, 0.25);
}

.f1-news-page__list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(460px, 1fr));
  gap: 16px;
  padding: 12px 0 4px;
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
  min-height: 160px;
  row-gap: 12px;
}

.f1-news-row__media {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #000;
}

.f1-news-row__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

@media (max-width: 720px) {
  .f1-news-row {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .f1-news-row__media {
    max-height: 200px;
  }
}

</style>
