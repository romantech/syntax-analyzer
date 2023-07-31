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
    path: SITE_URLS.ROOT,
    element: <App />,
    children: [
      {
        path: SITE_URLS.ROOT,
        element: <HomePage />,
      },
      {
        path: SITE_URLS.SYNTAX_ANALYZER.ROOT,
        element: <SyntaxAnalyzerPage />,
      },
      {
        path: SITE_URLS.SYNTAX_EDITOR.ROOT,
        element: <SyntaxEditorPage />,
        children: [
          {
            path: SITE_URLS.SYNTAX_EDITOR.ROOT,
            element: <SentenceManager />,
          },
          {
            path: SITE_URLS.SYNTAX_EDITOR.TAGGING,
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
