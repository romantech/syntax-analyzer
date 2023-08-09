import { AnalysisSource } from '@/features/syntax-editor';

export const SITE_URLS = {
  ROOT: '/',
  SYNTAX_ANALYZER: {
    ROOT: '/syntax-analyzer',
  },
  SYNTAX_EDITOR: {
    ROOT: '/syntax-editor',
    EDIT: '/syntax-editor/:source/:index',
  },
} as const;

export const getSyntaxEditorPath = (source: AnalysisSource, index: number) =>
  SITE_URLS.SYNTAX_EDITOR.EDIT.replace(/:source|:index/g, (m) => {
    return m === ':source' ? source : index.toString();
  });
