import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { RouterProvider } from 'react-router-dom';
import router from '@/Router';
import theme from '@/theme';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { REMAINING_COUNT_BASE_KEY } from '@/queries/useRemainingCountQuery';
import { REMAINING_COUNT_STALE_TIME } from '@/constants/config';

const rootElement = document.getElementById('root');

const queryClient = new QueryClient();
queryClient.setQueryDefaults(REMAINING_COUNT_BASE_KEY, {
  staleTime: REMAINING_COUNT_STALE_TIME,
});

ReactDOM.createRoot(rootElement!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
