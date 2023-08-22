import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { theme, toastOptions } from '@/theme';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ConfiguredQueryProvider } from '@/lib';
import { Analytics } from '@vercel/analytics/react';

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme} toastOptions={toastOptions}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ConfiguredQueryProvider>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        <RouterProvider router={router} />
        <Analytics />
      </ConfiguredQueryProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
