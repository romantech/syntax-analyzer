import { createBrowserRouter } from 'react-router';

import { lazyImport } from '@/base';
import ErrorComponent from '@/features/misc/pages/error-component';

import { SITE_URLS } from './paths';

const { App } = lazyImport(() => import('@/app'));

const { Home } = lazyImport(() => import('@/features/misc'));

const { SyntaxAnalyzer } = lazyImport(() => import('@/features/syntax-analyzer'));

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
        ],
      },
    ],
  },
]);
