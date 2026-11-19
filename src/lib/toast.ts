import { type ToastProviderProps, useToast } from '@chakra-ui/react';

type ToastOptions = {
  title: string;
  status: 'success' | 'error';
  duration?: number;
};

export function useAppToast(): (options: ToastOptions) => void {
  return useToast();
}

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
