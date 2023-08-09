import { AnalysisSource } from '@/features/syntax-editor';

export const SITE_URLS = {
  ROOT: '/',
  SYNTAX_ANALYZER: {
    ROOT: '/syntax-analyzer',
  },
  SYNTAX_EDITOR: {
    ROOT: '/syntax-editor',
    SENTENCE: '/syntax-editor/sentence',
    TAGGING: '/syntax-editor/sentence/:source/:index',
  },
} as const;

export const getSyntaxTaggingPath = (source: AnalysisSource, index: number) =>
  SITE_URLS.SYNTAX_EDITOR.TAGGING.replace(':source', source).replace(
    ':index',
    index.toString(),
  );
