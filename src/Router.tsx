import { createBrowserRouter } from 'react-router-dom';
import React from 'react';
import App from '@/App';
import { ErrorPage, SyntaxAnalyzerPage, SyntaxEditorPage } from '@/pages';
import { SITE_URLS } from '@/constants/siteUrls.ts';

const router = createBrowserRouter([
  {
    path: SITE_URLS.root,
    element: <App />,
    children: [
      {
        path: SITE_URLS.syntaxAnalyzer,
        element: <SyntaxAnalyzerPage />,
      },
      {
        path: SITE_URLS.syntaxEditor,
        element: <SyntaxEditorPage />,
      },
      {
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
]);

export default router;
