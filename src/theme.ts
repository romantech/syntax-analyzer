import { createSystem, defaultConfig, defineConfig, defineRecipe } from '@chakra-ui/react';

const fontFamily =
  '"Pretendard Variable", system-ui, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';

const config = defineConfig({
  theme: {
    tokens: {
      fonts: { body: { value: fontFamily }, heading: { value: fontFamily } },
      colors: {
        gray: {
          50: { value: '#f7fafc' },
          100: { value: '#edf2f7' },
          200: { value: '#e2e8f0' },
          300: { value: '#cbd5e0' },
          400: { value: '#a0aec0' },
          500: { value: '#718096' },
          600: { value: '#4a5568' },
          700: { value: '#2d3748' },
          800: { value: '#1a202c' },
          900: { value: '#171923' },
        },
        grayAlpha: {
          50: { value: 'rgba(26, 32, 43, 0.04)' },
          100: { value: 'rgba(26, 32, 43, 0.06)' },
          200: { value: 'rgba(26, 32, 43, 0.08)' },
          300: { value: 'rgba(26, 32, 43, 0.16)' },
          400: { value: 'rgba(26, 32, 43, 0.24)' },
          500: { value: 'rgba(26, 32, 43, 0.36)' },
          600: { value: 'rgba(26, 32, 43, 0.48)' },
          700: { value: 'rgba(26, 32, 43, 0.64)' },
          800: { value: 'rgba(26, 32, 43, 0.80)' },
          900: { value: 'rgba(26, 32, 43, 0.92)' },
        },
      },
    },
    semanticTokens: {
      colors: {
        bg: { value: { base: '{colors.white}', _dark: '{colors.gray.800}' } },
        description: { value: { base: '{colors.gray.600}', _dark: '{colors.gray.400}' } },
      },
    },
    recipes: {
      input: defineRecipe({ base: { _placeholder: { color: 'description', opacity: 1 } } }),
    },
  },
  globalCss: {
    body: {
      bg: 'bg',
      paddingLeft: 'env(safe-area-inset-left, 0px)',
      paddingRight: 'env(safe-area-inset-right, 0px)',
    },
    '*::-webkit-scrollbar': { width: '6px', height: '6px' },
    '*::-webkit-scrollbar-track': { background: 'transparent' },
    '*::-webkit-scrollbar-thumb': { backgroundColor: 'gray.500', borderRadius: 'full' },
    '*::-webkit-scrollbar-thumb:hover': { backgroundColor: 'description' },
    '*': {
      '@supports not selector(::-webkit-scrollbar)': {
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--chakra-colors-gray-500) transparent',
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
