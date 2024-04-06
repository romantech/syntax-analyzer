import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Analytics } from '@vercel/analytics/react';
import { RouterProvider } from 'react-router-dom';

import { ConfiguredQueryProvider } from '@/lib';
import { router } from '@/routes';
import { theme, toastOptions } from '@/theme';

const rootElement = document.getElementById('root');

createRoot(rootElement!).render(
  <StrictMode>
    <Analytics />
    <ChakraProvider theme={theme} toastOptions={toastOptions}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ConfiguredQueryProvider>
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
        <RouterProvider router={router} />
      </ConfiguredQueryProvider>
    </ChakraProvider>
  </StrictMode>,
);
