export const CONSTITUENT_DATA_ATTRS = {
  INDEX: 'data-token-index',
  ABBR: 'data-constituent-abbr',
  LABEL: 'data-constituent-label',
  ID: 'data-constituent-id',
  BEGIN: 'data-segment-begin',
  END: 'data-segment-end',
} as const;

export const CONSTITUENT_CLASSES = {
  CONSTITUENT: 'constituent',
  TOKEN_GROUP: 'token-group',
  CLAUSE: 'clause',
  PHRASE: 'phrase',
  TOKEN: 'token',
} as const;
