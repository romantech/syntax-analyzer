import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ChakraProvider } from '@chakra-ui/react';

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement!).render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
);
