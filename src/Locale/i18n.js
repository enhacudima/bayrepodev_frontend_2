import { createI18n } from 'vue-i18n'
import Cookies from 'js-cookie'
import { nextTick } from 'vue'
import pt from './Locales/pt.json'
import en from './Locales/en.json'
let i18n

export const SUPPORT_LOCALES = ['en', 'pt']

export function setI18nLanguage(locale) {
  loadLocaleMessages(locale)

  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale
  } else {
    i18n.global.locale.value = locale
  }

  document.querySelector('html').setAttribute('lang', locale)
  localStorage.setItem('lang', locale)
}

export async function loadLocaleMessages(locale) {
  // load locale messages with dynamic import
  const messages = await import(
    /* webpackChunkName: "locale-[request]" */ `./Locales/${locale}.json`
  )

  // set locale and locale message
  i18n.global.setLocaleMessage(locale, messages)
  return nextTick()
}

if (!i18n) {
  let localeStore = Cookies.get('locale' + import.meta.env.VITE_APP_PORT)
  let locale = localeStore || 'en'

  const messages = await import(
    /* webpackChunkName: "locale-[request]" */ `./Locales/${locale}.json`
  )

  i18n = createI18n({
    globalInjection: true,
    legacy: false,
    locale: locale,
    fallbackLocale: 'pt',
    warnHtmlInMessage: 'off',
    messages: { messages }
  })

  setI18nLanguage(locale)
}

export default i18n
