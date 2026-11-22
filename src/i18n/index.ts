import i18n, { type i18n as I18n } from 'i18next';
import { initReactI18next } from 'react-i18next';

import {
  DEFAULT_LANGUAGE,
  getInitialLanguage,
  isLanguage,
  LANGUAGE_STORAGE_KEY,
  LANGUAGES,
  type Language,
} from './languages';
import en from './locales/en/translation.json';
import ja from './locales/ja/translation.json';
import ko from './locales/ko/translation.json';
import zhHans from './locales/zh-Hans/translation.json';

function readStoredLanguage() {
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch {
    return null;
  }
}

i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language;
  document.title = i18n.t('home.appTitle');
});

void i18n.use(initReactI18next).init({
  lng: getInitialLanguage(readStoredLanguage(), navigator.languages),
  supportedLngs: Object.keys(LANGUAGES),
  fallbackLng: DEFAULT_LANGUAGE,
  load: 'currentOnly',
  initAsync: false,
  resources: {
    ko: { translation: ko },
    en: { translation: en },
    'zh-Hans': { translation: zhHans },
    ja: { translation: ja },
  },
  interpolation: { escapeValue: false },
});

export function changeLanguage(language: string) {
  if (!isLanguage(language)) return;
  void i18n.changeLanguage(language);
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Language switching still works when storage is unavailable.
  }
}

export function getActiveLanguage(instance: I18n): Language {
  const language = instance.resolvedLanguage ?? null;
  return isLanguage(language) ? language : DEFAULT_LANGUAGE;
}

export default i18n;
