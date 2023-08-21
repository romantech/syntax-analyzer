import { AnalysisSource } from '@/features/syntax-editor';

export const SITE_URLS = {
  ROOT: '/',
  ANALYZER: {
    ROOT: '/analyzer',
  },
  EDITOR: {
    ROOT: '/editor',
    EDIT: '/editor/:source/:index',
  },
} as const;

export const getSyntaxEditorPath = (source: AnalysisSource, index: number) =>
  SITE_URLS.EDITOR.EDIT.replace(/:source|:index/g, (m) => {
    return m === ':source' ? source : index.toString();
  });
