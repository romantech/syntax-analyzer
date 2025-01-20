import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { RouterProvider } from 'react-router-dom';

import { ConfiguredQueryProvider } from '@/lib';
import { router } from '@/routes';
import { theme, toastOptions } from '@/theme';

const rootElement = document.getElementById('root');

createRoot(rootElement!).render(
  <StrictMode>
    <Analytics />
    <SpeedInsights />
    <ChakraProvider theme={theme} toastOptions={toastOptions}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ConfiguredQueryProvider>
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
        <RouterProvider
          router={router}
          future={{
            /** @see https://reactrouter.com/en/6.28.2/upgrading/future#v7_starttransition */
            v7_startTransition: true,
          }}
        />
      </ConfiguredQueryProvider>
    </ChakraProvider>
  </StrictMode>,
);
