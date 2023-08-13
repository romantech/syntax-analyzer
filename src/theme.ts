import {
  extendTheme,
  type ThemeConfig,
  ToastProviderProps,
} from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

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

export const theme = extendTheme({ config });
