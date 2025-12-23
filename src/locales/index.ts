import { createI18n } from 'vue-i18n'
import en from './en.json'
import zh from './zh.json'

type Locale = 'en' | 'zh'

const stored = (localStorage.getItem('f1_locale') as Locale | null) ?? 'en'
const initialLocale: Locale = stored === 'zh' ? 'zh' : 'en'

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'en',
  globalInjection: true,
  messages: { en, zh },
})

export const setLocale = (lang: Locale) => {
  i18n.global.locale.value = lang
  localStorage.setItem('f1_locale', lang)
}
