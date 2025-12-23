import { createI18n } from 'vue-i18n'
import en from './en.json'
import zh from './zh.json'

const stored = localStorage.getItem('f1_locale') || 'en'

export const i18n = createI18n({
  legacy: false,
  locale: stored,
  fallbackLocale: 'en',
  globalInjection: true,
  messages: { en, zh },
})

export const setLocale = (lang: string) => {
  i18n.global.locale.value = lang
  localStorage.setItem('f1_locale', lang)
}
