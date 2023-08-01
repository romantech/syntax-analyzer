export const SITE_URLS = {
  ROOT: '/',
  SYNTAX_ANALYZER: {
    ROOT: '/syntax-analyzer',
  },
  SYNTAX_EDITOR: {
    ROOT: '/syntax-editor',
    SENTENCE: '/syntax-editor/sentence',
    TAGGING: '/syntax-editor/sentence/:id',
  },
} as const;

export const getSyntaxTaggingPath = (id: string) =>
  `${SITE_URLS.SYNTAX_EDITOR.SENTENCE}/${id}`;
