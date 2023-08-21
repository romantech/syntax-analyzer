import {
  Colors,
  extendTheme,
  ThemeConfig,
  ToastProviderProps,
} from '@chakra-ui/react';

export const toastOptions: ToastProviderProps = {
  defaultOptions: {
    duration: 3000,
    isClosable: true,
    containerStyle: {
      position: 'relative',
      bottom: 5,
    },
  },
};

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

export const theme = extendTheme({ config, colors, semanticTokens });
