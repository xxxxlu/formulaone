<template>
  <section class="f1-hero">
    <div class="f1-container f1-hero__inner">
      <div class="f1-hero__content">
        <div class="f1-hero__status">
          <span class="f1-hero__status-dot"></span>
          <span class="f1-hero__status-text">2025 World Champion // Norris Live Feed</span>
        </div>
        <h1 class="f1-hero__title">
          LANDO
          <br />
          <span class="f1-hero__velocity text-glow-blue">NORRIS</span>
          <br />
          <span class="f1-hero__subtitle">WORLD CHAMPION 2025</span>
        </h1>
        <div class="f1-hero__accent"></div>
        <p class="f1-hero__lead">
          A title season built on relentless pace, clean execution, and a McLaren package that stayed ice-cool under
          pressure. Relive the decisive laps, data traces, and moments that sealed the crown.
        </p>
        <div class="f1-hero__actions">
          <F1Button class="f1-hero__primary" variant="solid" size="lg" :accent="'var(--neon-blue)'" :textColor="'#000'">
            Watch Title Run
            <span class="material-symbols-outlined f1-hero__cta-icon">arrow_forward</span>
          </F1Button>
          <F1Button class="f1-hero__ghost" variant="ghost" size="lg" :accent="'var(--neon-red)'">
            <span class="material-symbols-outlined f1-hero__cta-icon f1-hero__cta-icon--red">play_circle</span>
            Norris Story
          </F1Button>
        </div>
      </div>
      <div class="f1-hero__visual">
        <div class="f1-orbits">
          <div class="f1-orbit f1-orbit--primary"></div>
          <div class="f1-orbit f1-orbit--secondary"></div>
        </div>
        <div class="f1-hero-card rotate-3d">
          <div class="f1-hero-card__frame">
            <div class="f1-hero-card__glow"></div>
            <div class="f1-hero-card__image">
              <img src="../../assets/public/norchap.jpg" alt="Formula 1 car speeding" />
              <div class="f1-hero-card__grid"></div>
              <div class="f1-hero-card__scan"></div>
              <div class="f1-hero-card__stat f1-hero-card__stat--left">
                <span class="f1-stat__label">AERO LOAD</span>
                <span class="f1-stat__value">12,450 <span class="f1-stat__unit">N</span></span>
              </div>
              <div class="f1-hero-card__stat f1-hero-card__stat--right">
                <span class="f1-stat__label">DRS STATUS</span>
                <span class="f1-stat__value">
                  <span class="f1-stat__dot"></span>
                  CLOSED
                </span>
              </div>
            </div>
          </div>
          <div class="f1-hero-card__shadow"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import F1Button from '../F1Button.vue'
</script>

<style scoped lang="scss">
:deep(.f1-hero__primary) {
  --f1-button-accent: var(--neon-blue);
  --f1-button-accent-glow: rgba(0, 243, 255, 0.35);
  --f1-button-text-strong: #000;
}

:deep(.f1-hero__ghost) {
  --f1-button-bg: rgba(255, 255, 255, 0.05);
  --f1-button-border: rgba(255, 255, 255, 0.2);
  --f1-button-text: #fff;
  --f1-button-text-strong: #fff;
  --f1-button-accent: var(--neon-red);
  backdrop-filter: blur(6px);
}

.f1-hero__cta-icon {
  font-size: 18px;
}

.f1-hero__cta-icon--red {
  color: var(--neon-red);
}

.f1-hero {
  position: relative;
  z-index: 1;
  padding: 48px 24px 90px;
}

.f1-hero__inner {
  display: grid;
  gap: 48px;
  align-items: center;
}

.f1-hero__content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.f1-hero__status {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--neon-red);
  font-family: var(--font-tech);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.f1-hero__status-dot {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--neon-red);
}

.f1-hero__status-dot::after {
  content: '';
  position: absolute;
  inset: -6px;
  border: 1px solid rgba(255, 0, 60, 0.5);
  border-radius: 50%;
  animation: ping 1.6s ease-out infinite;
}

.f1-hero__title {
  font-family: var(--font-display);
  font-size: clamp(42px, 7vw, 96px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #fff;
}

.f1-hero__subtitle {
  font-size: clamp(20px, 3vw, 32px);
  letter-spacing: 0.28em;
  color: var(--text-muted);
  display: inline-block;
  margin-top: 6px;
}

.f1-hero__velocity {
  display: inline-block;
  background: linear-gradient(90deg, var(--neon-blue), #fff, var(--neon-blue));
  -webkit-background-clip: text;
  color: transparent;
  animation: pulse-slow 3s ease-in-out infinite;
}

.f1-hero__accent {
  width: 90px;
  height: 4px;
  background: linear-gradient(90deg, var(--neon-red), transparent);
}

.f1-hero__lead {
  max-width: 420px;
  padding-left: 20px;
  border-left: 2px solid rgba(255, 255, 255, 0.1);
  font-family: var(--font-tech);
  font-size: 18px;
  color: var(--text-muted);
}

.f1-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.f1-hero__visual {
  position: relative;
  display: grid;
  place-items: center;
  perspective: 1000px;
}

.f1-orbits {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}

.f1-orbit {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(0, 243, 255, 0.2);
}

.f1-orbit--primary {
  width: 80%;
  height: 80%;
  animation: spin 10s linear infinite;
}

.f1-orbit--secondary {
  width: 60%;
  height: 60%;
  border-style: dotted;
  border-color: rgba(255, 0, 60, 0.2);
  animation: spin-reverse 15s linear infinite;
}

.f1-hero-card {
  position: relative;
  z-index: 1;
  width: min(100%, 720px);
}

.f1-hero-card__frame {
  position: relative;
  padding: 4px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.45);
  overflow: hidden;
}

.f1-hero-card__glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 243, 255, 0.15), transparent);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.f1-hero-card:hover .f1-hero-card__glow {
  opacity: 1;
}

.f1-hero-card__image {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: #000;
}

.f1-hero-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.1);
  transition: transform 0.7s ease, filter 0.7s ease;
  filter: grayscale(30%) contrast(1.25);
}

.f1-hero-card:hover .f1-hero-card__image img {
  transform: scale(1);
  filter: grayscale(0%) contrast(1.1);
}

.f1-hero-card__grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(0, 243, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 243, 255, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.2;
}

.f1-hero-card__scan {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 46%,
    rgba(0, 243, 255, 0.6) 50%,
    transparent 54%,
    transparent 100%
  );
  opacity: 0.6;
  animation: scan 3s ease-in-out infinite;
}

.f1-hero-card__stat {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.f1-hero-card__stat--left {
  top: 32px;
  left: 32px;
}

.f1-hero-card__stat--right {
  right: 32px;
  bottom: 32px;
  text-align: right;
}

.f1-stat__label {
  font-family: var(--font-tech);
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--neon-blue);
}

.f1-hero-card__stat--right .f1-stat__label {
  color: var(--neon-red);
}

.f1-stat__value {
  font-family: var(--font-display);
  font-size: 22px;
  color: #fff;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.f1-stat__unit {
  font-size: 12px;
  color: var(--text-dim);
}

.f1-stat__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--neon-red);
  box-shadow: 0 0 8px rgba(255, 0, 60, 0.8);
}

.f1-hero-card__shadow {
  position: absolute;
  inset: 10px -16px -16px 10px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: var(--f1-card);
  z-index: -1;
}

@media (min-width: 1024px) {
  .f1-hero__inner {
    grid-template-columns: 5fr 7fr;
  }
}
</style>
