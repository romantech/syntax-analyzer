import { AnalysisSource } from '@/features/syntax-editor';

export const SITE_URLS = {
  ROOT: '/',
  SYNTAX_ANALYZER: {
    ROOT: '/syntax-analyzer',
  },
  SYNTAX_EDITOR: {
    ROOT: '/syntax-editor',
    SENTENCE: '/syntax-editor/sentence',
    EDIT: '/syntax-editor/sentence/:source/:index',
  },
} as const;

export const getSyntaxEditorPath = (source: AnalysisSource, index: number) =>
  SITE_URLS.SYNTAX_EDITOR.EDIT.replace(':source', source).replace(
    ':index',
    index.toString(),
  );
