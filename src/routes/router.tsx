import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '@/app';
import { Home, NotFound } from '@/features/misc';
import { SITE_URLS } from './paths';
import {
  SentenceManager,
  SyntaxEditor,
  SyntaxEditorRoot,
} from '@/features/syntax-editor';
import { SyntaxAnalyzer } from '@/features/syntax-analyzer';

export const router = createBrowserRouter([
  {
    path: SITE_URLS.ROOT,
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: SITE_URLS.ROOT,
        element: <Home />,
      },
      {
        path: SITE_URLS.SYNTAX_ANALYZER.ROOT,
        element: <SyntaxAnalyzer />,
      },
      {
        path: SITE_URLS.SYNTAX_EDITOR.ROOT,
        element: <SyntaxEditorRoot />,
        children: [
          {
            path: SITE_URLS.SYNTAX_EDITOR.ROOT,
            element: <Navigate to={SITE_URLS.SYNTAX_EDITOR.SENTENCE} replace />,
          },
          {
            path: SITE_URLS.SYNTAX_EDITOR.SENTENCE,
            element: <SentenceManager />,
          },
          {
            path: SITE_URLS.SYNTAX_EDITOR.EDIT,
            element: <SyntaxEditor />,
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
