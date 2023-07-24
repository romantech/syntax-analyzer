import { createBrowserRouter } from 'react-router-dom';
import React from 'react';
import App from '@/App';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: 'about',
    element: <div>About</div>,
  },
]);

export default router;
