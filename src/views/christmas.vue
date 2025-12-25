<template>
  <div class="christmas-page">
    <button class="back-btn" type="button" @click="goBack">
      <span class="material-symbols-outlined">arrow_back</span>
      <span>{{ $t('common.back') || 'Back' }}</span>
    </button>
    <iframe
      class="christmas-frame"
      src="/christmas.html"
      title="Christmas Tree Effect"
      referrerpolicy="no-referrer"
      allow="autoplay"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const goBack = () => {
  if (history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
};

const onMessage = (event: MessageEvent) => {
  if (event?.data?.type === 'letter-opened') {
    window.location.href = '/lottery';
  }
};

onMounted(() => {
  window.addEventListener('message', onMessage);
});

onBeforeUnmount(() => {
  window.removeEventListener('message', onMessage);
});
</script>

<style scoped>
.christmas-page {
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 1;
}

.christmas-frame {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.back-btn {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 20;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  backdrop-filter: blur(8px);
  cursor: pointer;
  transition: all 0.25s ease;
}

.back-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  border-color: rgba(255, 255, 255, 0.35);
}
</style>
