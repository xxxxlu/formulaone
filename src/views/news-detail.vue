<template>
  <div class="f1-news-detail">
    <div class="f1-news-detail__hero" v-if="article">
      <div class="f1-news-detail__hero-bg"></div>
      <img class="f1-news-detail__hero-img" :src="article.hero" :alt="article.title" />
      <div class="f1-news-detail__hero-overlay"></div>
      <div class="f1-container f1-news-detail__hero-content">
        <div class="f1-news-detail__badge">{{ article.tag }}</div>
        <h1 class="f1-news-detail__title">{{ article.title }}</h1>
        <div class="f1-news-detail__meta">
          <span>{{ article.author }}</span>
          <span class="f1-news-detail__dot"></span>
          <span>{{ formatDate(article.publishedAt) }}</span>
        </div>
        <div class="f1-news-detail__actions">
          <F1Button variant="ghost" size="sm" :accent="'var(--neon-blue)'" @click="goBack">
            <span class="material-symbols-outlined">arrow_back</span>
            {{ $t('news.back') }}
          </F1Button>
          <F1Button
            variant="ghost"
            size="sm"
            :accent="'var(--neon-red)'"
            :textColor="'#fff'"
            @click="openSource"
          >
            <span class="material-symbols-outlined">open_in_new</span>
            {{ $t('news.source') }}
          </F1Button>
        </div>
      </div>
    </div>

    <div class="f1-container f1-news-detail__body" v-if="article">
      <p class="f1-news-detail__excerpt">{{ article.excerpt }}</p>
      <div class="f1-news-detail__content">
        <p v-for="(paragraph, idx) in article.content" :key="idx">{{ paragraph }}</p>
      </div>
    </div>

    <div class="f1-container f1-news-detail__body" v-else>
      <p class="f1-news-detail__missing">{{ $t('news.notfound') }}</p>
      <F1Button variant="solid" size="sm" :accent="'var(--neon-blue)'" :textColor="'#000'" @click="goBack">
        {{ $t('news.back') }}
      </F1Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import F1Button from '../components/F1Button.vue'
import type { RootState, NewsItem } from '../store'

const route = useRoute()
const router = useRouter()
const store = useStore<RootState>()

const slug = computed(() => String(route.params.slug || ''))
const article = computed<NewsItem | null>(() => store.getters.newsBySlug(slug.value))

const formatDate = (date: string) => date.replace(/-/g, '.')

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/home')
  }
}

const openSource = () => {
  if (article.value?.sourceUrl) {
    window.open(article.value.sourceUrl, '_blank')
  }
}
</script>

<style scoped lang="scss">
.f1-news-detail {
  color: #fff;
  padding-bottom: 80px;
}

.f1-news-detail__hero {
  position: relative;
  min-height: 360px;
  height: clamp(380px, 55vw, 540px);
  display: grid;
  align-items: flex-end;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.f1-news-detail__hero-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 20%, rgba(0, 243, 255, 0.15), transparent 45%),
    radial-gradient(circle at 80% 30%, rgba(255, 0, 60, 0.12), transparent 40%),
    linear-gradient(180deg, rgba(5, 5, 5, 0) 0%, rgba(5, 5, 5, 0.85) 70%, rgba(5, 5, 5, 0.95) 100%);
  z-index: 1;
}

.f1-news-detail__hero-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transform: scale(1.02);
  background: #050505;
  filter: saturate(1.05);
}

.f1-news-detail__hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(5, 5, 5, 0.85) 70%, rgba(5, 5, 5, 0.95) 100%);
  z-index: 2;
}

.f1-news-detail__hero-content {
  position: relative;
  z-index: 3;
  padding: 60px 24px 40px;
  display: grid;
  gap: 16px;
}

.f1-news-detail__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  width: fit-content;
  border-radius: 999px;
  background: rgba(0, 243, 255, 0.12);
  border: 1px solid rgba(0, 243, 255, 0.3);
  font-family: var(--font-tech);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--neon-blue);
}

.f1-news-detail__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(26px, 4vw, 40px);
  letter-spacing: 0.05em;
  line-height: 1.1;
}

.f1-news-detail__meta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-tech);
  letter-spacing: 0.12em;
  color: var(--text-dim);
}

.f1-news-detail__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--neon-blue);
  box-shadow: 0 0 8px rgba(0, 243, 255, 0.5);
}

.f1-news-detail__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.f1-news-detail__body {
  padding: 32px 24px 0;
  display: grid;
  gap: 18px;
}

.f1-news-detail__excerpt {
  margin: 0;
  font-family: var(--font-tech);
  font-size: 16px;
  letter-spacing: 0.05em;
  color: #e5e7eb;
  border-left: 3px solid var(--neon-blue);
  padding-left: 12px;
}

.f1-news-detail__content {
  display: grid;
  gap: 14px;
  line-height: 1.8;
  color: #d1d5db;
}

@media (max-width: 720px) {
  .f1-news-detail__hero {
    height: clamp(320px, 65vw, 420px);
  }

  .f1-news-detail__hero-content {
    padding: 40px 18px 28px;
  }
}

.f1-news-detail__content p {
  margin: 0;
  font-family: var(--font-body, 'Manrope', sans-serif);
}

.f1-news-detail__missing {
  font-family: var(--font-tech);
  color: var(--text-dim);
}

@media (min-width: 768px) {
  .f1-news-detail__hero-content {
    padding: 100px 0 60px;
  }

  .f1-news-detail__excerpt {
    font-size: 18px;
  }
}
</style>
