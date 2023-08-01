import { Navigate, createBrowserRouter } from 'react-router-dom';
import React from 'react';
import App from '@/App';
import { ErrorPage, HomePage, SyntaxAnalyzerPage } from '@/pages';
import { SITE_URLS } from '@/constants/siteUrls';
import {
  SentenceManagerPage,
  SyntaxEditorPage,
  TaggingPage,
} from './pages/syntax-editor';

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
            element: <Navigate to={SITE_URLS.SYNTAX_EDITOR.SENTENCE} replace />,
          },
          {
            path: SITE_URLS.SYNTAX_EDITOR.SENTENCE,
            element: <SentenceManagerPage />,
          },
          {
            path: SITE_URLS.SYNTAX_EDITOR.TAGGING,
            element: <TaggingPage />,
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
