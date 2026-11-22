import { ChakraProvider } from '@chakra-ui/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { ThemeProvider } from 'next-themes';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';

import '@/i18n';

import { AppToaster, ConfiguredQueryProvider } from '@/lib';
import { router } from '@/routes';
import { system } from '@/theme';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <Analytics />
    <SpeedInsights />
    <ChakraProvider value={system}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        storageKey="chakra-ui-color-mode"
      >
        <ConfiguredQueryProvider>
          <ReactQueryDevtools initialIsOpen={false} position="bottom" />
          <RouterProvider router={router} />
        </ConfiguredQueryProvider>
        <AppToaster />
      </ThemeProvider>
    </ChakraProvider>
  </StrictMode>,
);
