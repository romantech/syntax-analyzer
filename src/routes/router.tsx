import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '@/app';
import { ErrorBoundary, Home } from '@/features/misc';
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
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
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
            index: true,
            element: <SentenceManager />,
          },
          {
            path: SITE_URLS.SYNTAX_EDITOR.EDIT,
            element: <SyntaxEditor />,
          },
          {
            path: '*',
            element: <Navigate to="." replace />,
          },
        ],
      },
    ],
  },
]);
