import { createBrowserRouter } from 'react-router-dom';
import React from 'react';
import App from '@/App';
import { siteUrls } from '@/constants/siteUrls.ts';
import { ErrorPage, SyntaxAnalyzerPage, SyntaxEditorPage } from '@/pages';

const router = createBrowserRouter([
  {
    path: siteUrls.root,
    element: <App />,
    children: [
      {
        path: siteUrls.syntaxAnalyzer,
        element: <SyntaxAnalyzerPage />,
      },
      {
        path: siteUrls.syntaxEditor,
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
