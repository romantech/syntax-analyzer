import { defineConfig } from 'i18next-cli';

// The CLI loads this config in Node, so import the tag data directly.
import { SYNTAX_CONSTITUENTS } from './src/features/syntax-editor/data/syntax-constituents.ts';
import { DEFAULT_LANGUAGE, LANGUAGES } from './src/i18n/languages.ts';

export default defineConfig({
  locales: Object.keys(LANGUAGES),
  extract: {
    input: ['src/**/*.{ts,tsx}'],
    output: 'src/i18n/locales/{{language}}/{{namespace}}.json',
    primaryLanguage: DEFAULT_LANGUAGE,
  },
  plugins: [
    {
      name: 'grammar-tags',
      onEnd(keys) {
        const ns = 'translation';
        for (const { elementId } of SYNTAX_CONSTITUENTS) {
          for (const field of ['name', 'description']) {
            const key = `tags.tag${elementId}.${field}`;
            keys.set(`${ns}:${key}`, { key, ns });
          }
        }
      },
    },
  ],
  types: {
    input: 'src/i18n/locales/ko/*.json',
    output: 'src/i18n/i18next.d.ts',
    resourcesFile: 'src/i18n/resources.d.ts',
  },
});
