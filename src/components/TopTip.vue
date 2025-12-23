<template>
  <Teleport to="body">
    <transition name="tip-slide">
      <div v-if="open" class="top-tip">
        <span class="material-symbols-outlined top-tip__icon">info</span>
        <span class="top-tip__text">{{ message }}</span>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean
  message: string
}>()
</script>

<style scoped lang="scss">
.top-tip {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3000;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: 14px;
  background: rgba(17, 24, 39, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
  color: #e5e7eb;
  backdrop-filter: blur(10px);
}

.top-tip__icon {
  font-size: 20px;
  color: #60a5fa;
}

.top-tip__text {
  font-family: var(--font-tech, 'Inter', sans-serif);
  letter-spacing: 0.05em;
}

.tip-slide-enter-active,
.tip-slide-leave-active {
  transition: all 0.25s ease;
}

.tip-slide-enter-from,
.tip-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, -12px);
}
</style>
