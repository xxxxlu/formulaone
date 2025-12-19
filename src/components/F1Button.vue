<template>
  <button
    class="f1-button"
    :class="[
      `f1-button--${variant}`,
      `f1-button--${size}`,
      { 'is-active': active, 'is-square': square, 'is-transparent': transparent },
    ]"
    :type="type"
    :disabled="disabled"
    :style="accentStyle"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type ButtonVariant = 'solid' | 'outline' | 'ghost'

type ButtonSize = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    active?: boolean
    square?: boolean
    transparent?: boolean
    accent?: string
    accentGlow?: string
    textColor?: string
  }>(),
  {
    variant: 'ghost',
    size: 'md',
    type: 'button',
    disabled: false,
    active: false,
    square: false,
    transparent: false,
    accent: undefined,
    accentGlow: undefined,
    textColor: undefined,
  }
)

const accentStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.accent) {
    style['--f1-button-accent'] = props.accent
  }
  if (props.accentGlow) {
    style['--f1-button-accent-glow'] = props.accentGlow
  }
  if (props.textColor) {
    style['--f1-button-text'] = props.textColor
    style['--f1-button-text-strong'] = props.textColor
  }
  return style
})
</script>

<style scoped lang="scss">
.f1-button {
  --f1-button-accent: var(--neon-blue);
  --f1-button-accent-glow: rgba(0, 243, 255, 0.35);
  --f1-button-bg: rgba(255, 255, 255, 0.05);
  --f1-button-border: rgba(255, 255, 255, 0.12);
  --f1-button-text: var(--f1-button-muted);
  --f1-button-text-strong: #fff;
  --f1-button-muted: #9ca3af;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 6px;
  border: 1px solid var(--f1-button-border);
  background: var(--f1-button-bg);
  color: var(--f1-button-text);
  font-family: var(--f1-button-font, var(--font-display));
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease,
    background 0.2s ease, color 0.2s ease;
}

.f1-button--md {
  padding: 10px 18px;
  font-size: 11px;
}

.f1-button--lg {
  padding: 14px 28px;
  font-size: 12px;
}

.f1-button--sm {
  padding: 6px 12px;
  font-size: 10px;
}

.f1-button--solid {
  background: var(--f1-button-accent);
  border-color: var(--f1-button-accent);
  color: var(--f1-button-text-strong);
  box-shadow: 0 0 12px var(--f1-button-accent-glow);
}

.f1-button--outline {
  background: transparent;
  border-color: var(--f1-button-accent);
  color: var(--f1-button-accent);
}

.f1-button--ghost:hover {
  border-color: var(--f1-button-accent);
  color: var(--f1-button-text-strong);
}

.f1-button--outline:hover {
  background: var(--f1-button-accent);
  color: #000;
  box-shadow: 0 0 12px var(--f1-button-accent-glow);
}

.f1-button--solid:hover {
  transform: translateY(-1px);
}

.f1-button.is-active {
  background: var(--f1-button-accent);
  border-color: var(--f1-button-accent);
  color: var(--f1-button-text-strong);
  box-shadow: 0 0 12px var(--f1-button-accent-glow);
}

.f1-button.is-transparent {
  background: transparent;
  box-shadow: none;
}

.f1-button.is-square {
  padding: 0;
  width: 40px;
  height: 40px;
}

.f1-button--sm.is-square {
  width: 32px;
  height: 32px;
}

.f1-button--lg.is-square {
  width: 48px;
  height: 48px;
}

.f1-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}
</style>
