<template>
  <footer class="f1-footer">
    <div class="f1-footer__bg"></div>
    <div class="f1-container f1-footer__inner">
      <div class="f1-footer__top">
        <div class="f1-footer__brand">
          <span class="material-symbols-outlined">speed</span>
          <div>
            <div class="f1-footer__title">F1<span>.HUB</span></div>
            <div class="f1-footer__tagline">Official Telemetry Partner</div>
          </div>
        </div>
        <div class="f1-footer__social">
          <a class="f1-footer__icon" href="#" aria-label="Global feed">
            <span class="material-symbols-outlined">public</span>
          </a>
          <a class="f1-footer__icon" href="#" aria-label="Email">
            <span class="material-symbols-outlined">alternate_email</span>
          </a>
          <a class="f1-footer__icon" href="#" aria-label="RSS">
            <span class="material-symbols-outlined">rss_feed</span>
          </a>
        </div>
      </div>
      <div class="f1-footer__divider"></div>
      <div class="f1-footer__bottom">
        <p>© 2024 F1 HUB System. Unofficial Data Stream.</p>
        <div class="f1-footer__links">
          <a href="#">Privacy Protocol</a>
          <a href="#">System Terms</a>
          <a href="#">Data Nodes</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.f1-footer {
  position: relative;
  z-index: 1;
  padding: 40px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: var(--f1-black);
  overflow: hidden;
}

.f1-footer__bg {
  position: absolute;
  inset: 0;
  background-size: 40px 40px;
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  opacity: 0.08;
  pointer-events: none;
}

.f1-footer__inner {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.f1-footer__top {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
}

.f1-footer__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-display);
}

.f1-footer__brand .material-symbols-outlined {
  font-size: 32px;
  color: var(--neon-red);
}

.f1-footer__title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.15em;
}

.f1-footer__title span {
  color: var(--neon-red);
}

.f1-footer__tagline {
  font-family: var(--font-tech);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--text-dim);
}

.f1-footer__social {
  display: flex;
  gap: 12px;
}

.f1-footer__icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-muted);
  transition: all 0.2s ease;
}

.f1-footer__icon:hover {
  border-color: var(--neon-blue);
  color: var(--neon-blue);
  background: rgba(0, 243, 255, 0.1);
}

.f1-footer__divider {
  height: 1px;
  width: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
}

.f1-footer__bottom {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  font-family: var(--font-tech);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--text-dim);
}

.f1-footer__links {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.f1-footer__links a {
  transition: color 0.2s ease;
}

.f1-footer__links a:hover {
  color: var(--neon-blue);
}

@media (min-width: 768px) {
  .f1-footer__top {
    flex-direction: row;
  }

  .f1-footer__bottom {
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
