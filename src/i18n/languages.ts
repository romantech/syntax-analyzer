export const LANGUAGES = {
  ko: '한국어',
  en: 'English',
  'zh-Hans': '简体中文',
  ja: '日本語',
} as const;

export type Language = keyof typeof LANGUAGES;

export const DEFAULT_LANGUAGE = 'ko';
export const LANGUAGE_STORAGE_KEY = 'syntax-analyzer-language';

export function isLanguage(value: string | null): value is Language {
  return value !== null && Object.hasOwn(LANGUAGES, value);
}

export function getInitialLanguage(
  storedLanguage: string | null,
  browserLanguages: readonly string[],
): Language {
  if (isLanguage(storedLanguage)) return storedLanguage;

  for (const tag of browserLanguages) {
    const [language, scriptOrRegion] = tag.toLowerCase().split('-');
    switch (language) {
      case 'ko':
      case 'en':
      case 'ja':
        return language;
      case 'zh':
        if (
          !scriptOrRegion ||
          scriptOrRegion === 'hans' ||
          scriptOrRegion === 'cn' ||
          scriptOrRegion === 'sg'
        ) {
          return 'zh-Hans';
        }
        break;
    }
  }

  return DEFAULT_LANGUAGE;
}
