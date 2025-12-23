import { createApp } from 'vue'
import './styles/index.scss'
import App from './App.vue'
import router from './router'
import store from './store'
import { i18n } from './locales'

createApp(App).use(router).use(store).use(i18n).mount('#app')

console.log(
  '%cFORMULA 1',
  [
    'font-size: 64px',
    'font-weight: 900',
    'font-family: "Chakra Petch", "Orbitron", "Manrope", sans-serif',
    'color: #18d8f6',
    'text-shadow: 3px 3px 0 #f4ad23, 6px 6px 12px rgba(0,0,0,0.35)',
    'letter-spacing: 3px',
  ].join(';')
)
