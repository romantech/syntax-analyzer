import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { RouterProvider } from 'react-router-dom';
import router from '@/router';
import theme from '@/theme';

import { REMAINING_COUNT_BASE_KEY } from '@/queries/use-remaining-count-query';
import { REMAINING_COUNT_STALE_TIME } from '@/constants/config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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
