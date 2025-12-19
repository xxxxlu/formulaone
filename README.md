# Formula One Hub (Vue 3 + TS + Vite)

F1-styled single-page experience with live-inspired telemetry visuals, 2025 grid roster, and curated news pulled into Vuex for a consistent data layer across the site.

## Highlights
- **Hero + Countdown**: Futuristic F1 aesthetic with animated race countdowns, track spotlight, and glowing motion accents.
- **Telemetry + Tracks**: Circuit map cards, stats, and fullscreen viewing fed by Vuex track data.
- **Drivers (2025 Grid)**: Card layout themed per team color; hover effects, stats, and torso-cropped driver renders.
- **News Hub**: Home highlights plus dedicated news listing and detail view with imagery sized for clarity.
- **Shared UI Kit**: Custom F1 buttons and selects for consistent neon/tech styling.

## Tech Stack
- Vue 3 + TypeScript + Vite
- Vuex (state), Vue Router (pages)
- SCSS modules per view + shared `src/styles/index.scss` for globals

## Project Structure (core)
- `src/views/home.vue` – Landing, countdown, telemetry, news highlights
- `src/views/deivers.vue` – Drivers grid (2025 season data from store)
- `src/views/news.vue` / `src/views/news-detail.vue` – News list and article view
- `src/layout/header.vue`, `src/layout/footer.vue` – Shell with animated nav
- `src/components/F1Button.vue`, `src/components/F1Select.vue` – Reusable controls
- `src/store/index.ts` – Centralized drivers/tracks/calendar/news data

## Getting Started
```bash
npm install
npm run dev
# npm run build  # production bundle
```

## Notes
- All imagery is referenced locally in `src/assets` where available; external news images remain remote.
- Styles favor F1 neon/tech motifs; adjust tokens in `src/styles/index.scss` or per-view SCSS blocks for theming tweaks.
