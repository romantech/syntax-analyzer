import { createBrowserRouter, Navigate } from 'react-router-dom';
import { SITE_URLS } from './paths';
import { lazyImport } from '@/base';

const { App } = lazyImport(() => import('@/app'));

const { ErrorComponent, Home } = lazyImport(() => import('@/features/misc'));

const { SyntaxAnalyzer } = lazyImport(
  () => import('@/features/syntax-analyzer'),
);

const { SentenceManager, SyntaxEditor, SyntaxEditorRoot } = lazyImport(
  () => import('@/features/syntax-editor'),
);

export const router = createBrowserRouter([
  {
    path: SITE_URLS.ROOT,
    element: <App />,
    errorElement: <ErrorComponent />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: SITE_URLS.ANALYZER.ROOT,
        element: <SyntaxAnalyzer />,
      },
      {
        path: SITE_URLS.EDITOR.ROOT,
        element: <SyntaxEditorRoot />,
        children: [
          {
            index: true,
            element: <SentenceManager />,
          },
          {
            path: SITE_URLS.EDITOR.EDIT,
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
