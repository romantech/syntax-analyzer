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

const localeFonts: Partial<Record<Language, { id: string; href: string }>> = {
  ja: {
    id: 'pretendard-jp',
    href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-jp-dynamic-subset.min.css',
  },
  'zh-Hans': {
    id: 'noto-sans-sc',
    href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400..800&display=swap',
  },
};

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

  const font = isLanguage(language) ? localeFonts[language] : undefined;
  if (!font || document.getElementById(font.id)) return;

  const stylesheet = document.createElement('link');
  stylesheet.id = font.id;
  stylesheet.rel = 'stylesheet';
  stylesheet.crossOrigin = 'anonymous';
  stylesheet.href = font.href;
  stylesheet.addEventListener('error', () => stylesheet.remove(), { once: true });
  document.head.append(stylesheet);
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
