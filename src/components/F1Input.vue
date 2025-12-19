<template>
  <div class="f1-input" :class="{ 'f1-input--block': block }">
    <label v-if="label" :for="controlId" class="f1-input__label">{{ label }}</label>
    <div class="f1-input__field">
      <span v-if="icon" class="material-symbols-outlined f1-input__icon">{{ icon }}</span>
      <input
        :id="controlId"
        class="f1-input__control"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :value="modelValue"
        @input="onInput"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    type?: string
    placeholder?: string
    icon?: string
    label?: string
    id?: string
    disabled?: boolean
    block?: boolean
  }>(),
  {
    type: 'text',
    placeholder: '',
    icon: undefined,
    label: undefined,
    id: undefined,
    disabled: false,
    block: false,
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const controlId = computed(() => props.id ?? `f1-input-${Math.random().toString(36).slice(2, 9)}`)

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped lang="scss">
.f1-input {
  --f1-control-bg: #151a23;
  --f1-control-border: rgba(255, 255, 255, 0.12);
  --f1-control-text: #f8fafc;
  --f1-control-muted: #9ca3af;
  --f1-control-accent: var(--neon-blue);
  --f1-control-ring: rgba(0, 243, 255, 0.2);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--f1-control-font, var(--font-tech));
}

.f1-input--block {
  width: 100%;
}

.f1-input__label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--f1-control-muted);
}

.f1-input__field {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.f1-input__icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--f1-control-muted);
  font-size: 18px;
}

.f1-input__control {
  width: 100%;
  min-width: 200px;
  height: 36px;
  border-radius: 4px;
  border: 1px solid var(--f1-control-border);
  background: var(--f1-control-bg);
  padding: 0 12px;
  font-family: inherit;
  font-size: 12px;
  letter-spacing: 0.2em;
  color: var(--f1-control-text);
}

.f1-input__control::placeholder {
  color: #4b5563;
}

.f1-input__control:focus {
  outline: none;
  border-color: var(--f1-control-accent);
  box-shadow: 0 0 0 2px var(--f1-control-ring);
}

.f1-input__control:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.f1-input__field .f1-input__control {
  padding-left: 36px;
}
</style>
