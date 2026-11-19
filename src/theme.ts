import { type Colors, extendTheme, type ThemeConfig } from '@chakra-ui/react';

const semanticTokens: Colors = {
  colors: {
    description: {
      default: 'gray.600',
      _dark: 'gray.400',
    },
  },
};

const colors: Colors = {
  grayAlpha: {
    50: 'rgba(26, 32, 43, 0.04)',
    100: 'rgba(26, 32, 43, 0.06)',
    200: 'rgba(26, 32, 43, 0.08)',
    300: 'rgba(26, 32, 43, 0.16)',
    400: 'rgba(26, 32, 43, 0.24)',
    500: 'rgba(26, 32, 43, 0.36)',
    600: 'rgba(26, 32, 43, 0.48)',
    700: 'rgba(26, 32, 43, 0.64)',
    800: 'rgba(26, 32, 43, 0.80)',
    900: 'rgba(26, 32, 43, 0.92)',
  },
};

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const fontFamily =
  '"Pretendard Variable", system-ui, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';

export const theme = extendTheme({
  config,
  colors,
  semanticTokens,
  fonts: { body: fontFamily, heading: fontFamily },
  styles: {
    global: {
      body: {
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      },
      '*::-webkit-scrollbar': { width: '6px', height: '6px' },
      '*::-webkit-scrollbar-track': { background: 'transparent' },
      '*::-webkit-scrollbar-thumb': { backgroundColor: 'gray.500', borderRadius: 'full' },
      '*::-webkit-scrollbar-thumb:hover': { backgroundColor: 'description' },
      '@supports not selector(::-webkit-scrollbar)': {
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--chakra-colors-gray-500) transparent',
        },
      },
    },
  },
  components: {
    Input: {
      baseStyle: {
        field: {
          _placeholder: { color: 'description', opacity: 1 },
        },
      },
    },
  },
});
