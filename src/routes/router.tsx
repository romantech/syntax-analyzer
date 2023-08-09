import { createBrowserRouter, Navigate } from 'react-router-dom';
import React from 'react';
import App from '@/app';
import {
  ErrorPage,
  HomePage,
  SentenceManagerPage,
  SyntaxAnalyzerPage,
  SyntaxEditorPage,
  TaggingPage,
} from '@/pages';
import { SITE_URLS } from './paths';

export const router = createBrowserRouter([
  {
    path: SITE_URLS.ROOT,
    element: <App />,
    errorElement: <ErrorPage />,
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
            element: <SentenceManagerPage />,
          },
          {
            path: SITE_URLS.SYNTAX_EDITOR.SENTENCE,
            element: <SentenceManagerPage />,
          },
          {
            path: SITE_URLS.SYNTAX_EDITOR.TAGGING,
            element: <TaggingPage />,
          },
          {
            path: '*',
            element: <Navigate to={SITE_URLS.SYNTAX_EDITOR.SENTENCE} replace />,
          },
        ],
      },
    ],
  },
]);
