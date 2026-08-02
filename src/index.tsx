import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';

import '@/lib/configure-dotlottie';
import { ConfiguredQueryProvider } from '@/lib';
import { router } from '@/routes';
import { theme, toastOptions } from '@/theme';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <Analytics />
    <SpeedInsights />
    <ChakraProvider theme={theme} toastOptions={toastOptions}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ConfiguredQueryProvider>
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
        <RouterProvider router={router} />
      </ConfiguredQueryProvider>
    </ChakraProvider>
  </StrictMode>,
);
