<template>
  <section class="f1-next f1-card" :class="{ 'is-live': countdown.total <= 0 }">
    <div class="f1-next__panel f1-next__panel--info">
      <div class="f1-next__marker">
        <span class="material-symbols-outlined">flag</span>
        <span>{{ countdown.total > 0 ? $t('home.startsIn') : $t('home.nextRace') }}</span>
      </div>
      <h3 class="f1-next__title">
        <span v-if="activeEvent?.flag" class="f1-next__flag">{{ activeEvent.flag }}</span>
        {{ activeEvent?.name || $t('home.heroTitle') }}
      </h3>
      <div class="f1-next__location">
        <span class="material-symbols-outlined">location_on</span>
        <span>{{ activeEvent?.location || $t('home.calendar') }}</span>
      </div>
      <div class="f1-next__event-time">
        <span class="material-symbols-outlined">schedule</span>
        <span>{{ $t('home.eventTime') }}: {{ eventTime }}</span>
      </div>
    </div>
    <div class="f1-next__panel f1-next__panel--countdown">
      <div class="f1-countdown">
        <div class="f1-countdown__segment">
          <div class="f1-countdown__value-shell">
            <div class="f1-countdown__value">
              {{ pad(countdown.days) }}
            </div>
          </div>
          <span class="f1-countdown__label">{{ $t('home.countdownDays') }}</span>
        </div>
        <span class="f1-countdown__sep">:</span>
        <div class="f1-countdown__segment">
          <div class="f1-countdown__value-shell">
            <div class="f1-countdown__value">
              {{ pad(countdown.hours) }}
            </div>
          </div>
          <span class="f1-countdown__label">{{ $t('home.countdownHours') }}</span>
        </div>
        <span class="f1-countdown__sep">:</span>
        <div class="f1-countdown__segment">
          <div class="f1-countdown__value-shell">
            <div class="f1-countdown__value">
              {{ pad(countdown.minutes) }}
            </div>
          </div>
          <span class="f1-countdown__label">{{ $t('home.countdownMinutes') }}</span>
        </div>
        <span class="f1-countdown__sep">:</span>
        <div class="f1-countdown__segment">
          <div class="f1-countdown__value-shell">
            <div class="f1-countdown__value" :class="{ 'f1-countdown__value--alert': countdown.total <= 0 }">
              {{ pad(Math.max(0, countdown.seconds)) }}
            </div>
          </div>
          <span class="f1-countdown__label">{{ $t('home.countdownSeconds') }}</span>
        </div>
      </div>
      <div v-if="countdown.total <= 0" class="f1-countdown__flag">
        <span class="f1-countdown__flag-emoji">{{ activeEvent?.flag }}</span>
        <span class="f1-countdown__flag-text">{{ $t('home.heroTitle') }}: {{ activeEvent?.name }}</span>
      </div>
      <div class="f1-countdown__progress">
        <span :style="{ width: `${urgencyPercent}%` }"></span>
      </div>
    </div>
    <div class="f1-next__panel f1-next__panel--weather">
      <div class="f1-weather">
        <div class="f1-weather__icon f1-weather__icon--sun">
          <span class="material-symbols-outlined">sunny</span>
        </div>
        <div class="f1-weather__text">
          <span class="f1-weather__value">28°C</span>
          <span class="f1-weather__label">{{ $t('home.airTemp') }}</span>
        </div>
      </div>
      <div class="f1-weather__divider"></div>
      <div class="f1-weather">
        <div class="f1-weather__icon f1-weather__icon--heat">
          <span class="material-symbols-outlined">thermometer</span>
        </div>
        <div class="f1-weather__text">
          <span class="f1-weather__value">42°C</span>
          <span class="f1-weather__label">{{ $t('home.trackTemp') }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { CountdownEventWithTs, CountdownState } from './types'

const props = defineProps<{
  activeEvent: CountdownEventWithTs | null
  countdown: CountdownState
}>()

const pad = (value: number) => value.toString().padStart(2, '0')
const { locale } = useI18n()
const URGENCY_WINDOW_MS = 72 * 60 * 60 * 1000

const urgencyPercent = computed(() => {
  if (props.countdown.total <= 0) return 100
  const ratio = 1 - props.countdown.total / URGENCY_WINDOW_MS
  return Math.round(Math.min(Math.max(ratio, 0), 1) * 100)
})

const eventTime = computed(() => {
  const start = props.activeEvent?.start
  if (!start) return '--'
  const parsed = new Date(start)
  if (Number.isNaN(parsed.getTime())) return '--'
  return new Intl.DateTimeFormat(locale.value === 'zh' ? 'zh-CN' : 'en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed)
})
</script>

<style scoped lang="scss">
.f1-next {
  display: grid;
  overflow: hidden;
}

.f1-next.is-live {
  border-color: rgba(255, 0, 60, 0.3);
  box-shadow: 0 20px 44px rgba(255, 0, 60, 0.12);
}

.f1-next__panel {
  padding: 20px 22px;
  display: grid;
  gap: 12px;
}

.f1-next__panel--info {
  background: linear-gradient(135deg, rgba(0, 243, 255, 0.08), rgba(255, 0, 60, 0.08));
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.f1-next__panel--countdown {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent);
}

.f1-next__panel--weather {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.05));
}

.f1-next__marker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-tech);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--text-muted);
}

.f1-next__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(20px, 3.2vw, 30px);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.f1-next__flag {
  margin-right: 10px;
}

.f1-next__location {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-tech);
  font-size: 12px;
  letter-spacing: 0.14em;
  color: var(--text-dim);
}

.f1-next__event-time {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-tech);
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.f1-countdown {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
}

.f1-countdown__segment {
  display: grid;
  gap: 4px;
  justify-items: center;
}

.f1-countdown__value-shell {
  padding: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  text-align: center;
  min-width: 88px;
}

.f1-countdown__value {
  font-family: var(--font-display);
  font-size: 24px;
  color: #fff;
}

.f1-countdown__value--alert {
  color: var(--neon-red);
}

.f1-countdown__label {
  font-family: var(--font-tech);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-dim);
}

.f1-countdown__sep {
  font-family: var(--font-display);
  font-size: 22px;
  color: var(--text-muted);
}

.f1-countdown__flag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-tech);
  font-size: 12px;
  letter-spacing: 0.14em;
  color: var(--neon-blue);
}

.f1-countdown__flag-text {
  color: #fff;
}

.f1-countdown__progress {
  margin-top: 4px;
  width: 100%;
  height: 7px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.f1-countdown__progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, rgba(0, 243, 255, 0.8), rgba(255, 0, 60, 0.9));
  box-shadow: 0 0 10px rgba(0, 243, 255, 0.45);
  transition: width var(--duration-base) var(--ease-standard);
}

.f1-weather {
  display: flex;
  align-items: center;
  gap: 10px;
}

.f1-weather__icon {
  width: 32px;
  height: 32px;
  display: inline-grid;
  place-items: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
}

.f1-weather__icon--sun {
  color: var(--neon-yellow);
}

.f1-weather__icon--heat {
  color: var(--neon-red);
}

.f1-weather__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.f1-weather__value {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
}

.f1-weather__label {
  font-family: var(--font-tech);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--text-dim);
}

.f1-weather__divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
}

@media (min-width: 1024px) {
  .f1-next {
    grid-template-columns: 4fr 5fr 3fr;
  }

  .f1-next__panel--info,
  .f1-next__panel--countdown {
    border-bottom: none;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
  }
}

@media (max-width: 820px) {
  .f1-next__panel {
    padding: 16px 14px;
  }

  .f1-countdown {
    gap: 6px;
  }

  .f1-countdown__value-shell {
    min-width: 66px;
    padding: 10px;
  }

  .f1-countdown__value {
    font-size: 19px;
  }

  .f1-next__panel--weather {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .f1-next__panel {
    padding: 14px 12px;
  }

  .f1-countdown {
    gap: 6px;
    flex-wrap: wrap;
  }

  .f1-countdown__segment {
    gap: 2px;
  }

  .f1-countdown__value-shell {
    min-width: 68px;
    padding: 12px;
  }

  .f1-countdown__value {
    font-size: 20px;
  }

  .f1-countdown__label {
    font-size: 9px;
    letter-spacing: 0.12em;
  }

  .f1-countdown__sep {
    font-size: 16px;
  }

  .f1-next__panel--weather {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .f1-weather__divider {
    width: 100%;
    height: 1px;
  }
}
</style>
