import { createBrowserRouter } from 'react-router-dom';
import React from 'react';
import App from '@/App';
import {
  ErrorPage,
  HomePage,
  SyntaxAnalyzerPage,
  SyntaxEditorPage,
} from '@/pages';
import { SITE_URLS } from '@/constants/siteUrls';
import { SentenceManager, SyntaxEditor } from './pages/syntax-editor';

const router = createBrowserRouter([
  {
    path: SITE_URLS.root,
    element: <App />,
    children: [
      {
        path: SITE_URLS.root,
        element: <HomePage />,
      },
      {
        path: SITE_URLS.syntaxAnalyzer.root,
        element: <SyntaxAnalyzerPage />,
      },
      {
        path: SITE_URLS.syntaxEditor.root,
        element: <SyntaxEditorPage />,
        children: [
          {
            path: SITE_URLS.syntaxEditor.root,
            element: <SentenceManager />,
          },
          {
            path: SITE_URLS.syntaxEditor.edit,
            element: <SyntaxEditor />,
          },
        ],
      },
      {
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
]);

export default router;
