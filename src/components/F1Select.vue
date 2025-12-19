<template>
  <div ref="rootRef" class="f1-select" :class="{ 'f1-select--block': block }">
    <label v-if="label" :for="controlId" class="f1-select__label">{{ label }}</label>
    <div class="f1-select__field">
      <button
        :id="controlId"
        class="f1-select__control"
        type="button"
        :disabled="disabled"
        role="combobox"
        :aria-expanded="isOpen"
        :aria-controls="listId"
        aria-haspopup="listbox"
        @click="toggleOpen"
        @keydown="onTriggerKeydown"
      >
        <span class="f1-select__value">{{ displayLabel }}</span>
        <span class="material-symbols-outlined f1-select__icon">expand_more</span>
      </button>
      <transition name="f1-select">
        <ul
          v-if="isOpen"
          :id="listId"
          class="f1-select__menu"
          role="listbox"
          :aria-labelledby="controlId"
        >
          <li
            v-for="(option, index) in options"
            :key="option.value"
            class="f1-select__option"
            :class="{ 'is-selected': option.value === modelValue }"
            :style="{ '--delay': `${index * 30}ms` }"
            role="option"
            :aria-selected="option.value === modelValue"
            @click="selectOption(option.value)"
            @keydown="onOptionKeydown($event, index, option.value)"
            tabindex="0"
          >
            <span>{{ option.label }}</span>
            <span v-if="option.value === modelValue" class="material-symbols-outlined">check</span>
          </li>
        </ul>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type OptionValue = string | number

interface OptionItem {
  label: string
  value: OptionValue
}

const props = withDefaults(
  defineProps<{
    modelValue: OptionValue
    options: OptionItem[]
    label?: string
    id?: string
    placeholder?: string
    disabled?: boolean
    block?: boolean
  }>(),
  {
    options: () => [],
    label: undefined,
    id: undefined,
    placeholder: 'Select',
    disabled: false,
    block: false,
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: OptionValue): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const generatedId = `f1-select-${Math.random().toString(36).slice(2, 9)}`
const controlId = computed(() => props.id ?? generatedId)
const listId = computed(() => `${controlId.value}-list`)

const selectedOption = computed(() =>
  props.options.find((option) => option.value === props.modelValue)
)

const displayLabel = computed(
  () => selectedOption.value?.label ?? props.placeholder ?? String(props.modelValue)
)

const toggleOpen = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

const selectOption = (value: OptionValue) => {
  emit('update:modelValue', value)
  closeMenu()
}

const onTriggerKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return
  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    isOpen.value = true
  }
  if (event.key === 'Escape') {
    closeMenu()
  }
}

const onOptionKeydown = (event: KeyboardEvent, index: number, value: OptionValue) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    selectOption(value)
  }
  if (event.key === 'Escape') {
    closeMenu()
  }
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    const nextIndex =
      event.key === 'ArrowDown'
        ? Math.min(index + 1, props.options.length - 1)
        : Math.max(index - 1, 0)
    const items = rootRef.value?.querySelectorAll<HTMLLIElement>('.f1-select__option')
    items?.[nextIndex]?.focus()
  }
}

const onClickOutside = (event: MouseEvent) => {
  if (!rootRef.value) return
  if (!rootRef.value.contains(event.target as Node)) {
    closeMenu()
  }
}

watch(isOpen, (open) => {
  if (!open) return
  nextTick(() => {
    const selectedIndex = props.options.findIndex((option) => option.value === props.modelValue)
    const targetIndex = selectedIndex >= 0 ? selectedIndex : 0
    const items = rootRef.value?.querySelectorAll<HTMLLIElement>('.f1-select__option')
    items?.[targetIndex]?.focus()
  })
})

onMounted(() => {
  document.addEventListener('click', onClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<style scoped lang="scss">
.f1-select {
  --f1-control-bg: #151a23;
  --f1-control-border: rgba(255, 255, 255, 0.12);
  --f1-control-text: #f8fafc;
  --f1-control-muted: #9ca3af;
  --f1-control-accent: var(--neon-blue);
  --f1-control-ring: rgba(0, 243, 255, 0.2);
  --f1-control-glow: rgba(0, 243, 255, 0.35);
  --f1-control-panel: rgba(8, 11, 18, 0.95);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--f1-control-font, var(--font-display));
}

.f1-select--block {
  width: 100%;
}

.f1-select__label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--f1-control-muted);
}

.f1-select__field {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 2px;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.08), transparent);
  border-radius: 6px;
  overflow: visible;
}

.f1-select__control {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-width: 200px;
  background: linear-gradient(180deg, rgba(15, 19, 27, 0.92), rgba(8, 11, 18, 0.92));
  color: var(--f1-control-text);
  padding: 10px 42px 10px 14px;
  border-radius: 5px;
  border: 1px solid var(--f1-control-border);
  font-family: inherit;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.4);
  clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
}

.f1-select__control:focus {
  outline: none;
  border-color: var(--f1-control-accent);
  box-shadow: 0 0 0 2px var(--f1-control-ring), 0 0 18px var(--f1-control-glow);
}

.f1-select__control:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.f1-select__value {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.f1-select__icon {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--f1-control-muted);
  font-size: 18px;
  text-shadow: 0 0 12px rgba(0, 243, 255, 0.3);
}

.f1-select__menu {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  z-index: 20;
  margin: 0;
  padding: 8px;
  list-style: none;
  background: var(--f1-control-panel);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  box-shadow: 0 24px 40px rgba(0, 0, 0, 0.5);
  max-height: 260px;
  overflow-y: auto;
}

.f1-select__menu::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 28px 28px;
  opacity: 0.35;
  pointer-events: none;
}

.f1-select__option {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--f1-control-text);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
  animation: f1-select-item 0.25s ease both;
  animation-delay: var(--delay, 0ms);
}

.f1-select__option:hover,
.f1-select__option:focus {
  outline: none;
  background: rgba(0, 243, 255, 0.12);
  color: #fff;
  transform: translateX(2px);
}

.f1-select__option.is-selected {
  background: rgba(0, 243, 255, 0.18);
  border: 1px solid rgba(0, 243, 255, 0.4);
  box-shadow: inset 0 0 12px rgba(0, 243, 255, 0.2);
}

.f1-select__option .material-symbols-outlined {
  font-size: 16px;
  color: var(--f1-control-accent);
}

.f1-select-enter-active,
.f1-select-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.f1-select-enter-from,
.f1-select-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

@keyframes f1-select-item {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
