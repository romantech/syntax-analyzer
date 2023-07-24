import { createBrowserRouter } from 'react-router-dom';
import React from 'react';
import App from '@/App';
import SyntaxAnalyzerPage from '@/pages/SyntaxAnalyzerPage.tsx';
import SyntaxEditorPage from '@/pages/SyntaxEditorPage.tsx';
import { siteUrls } from '@/constants/siteUrls.ts';

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
    ],
  },
]);

export default router;
