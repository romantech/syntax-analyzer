enum Namespace {
  ANALYZER = 'analyzer',
}

enum AnalyzerFields {
  ANALYSIS = 'analysis',
  RANDOM_SENTENCE = 'random_sentence',
}

const ANALYZER_KEYS = {
  REMAINING: {
    TOTAL: `${Namespace.ANALYZER}:remaining:total`,
    USER: (ip: string) => {
      return `${Namespace.ANALYZER}:remaining:user:${ip}` as const;
    },
  },
  PROMPT: `${Namespace.ANALYZER}:prompt`,
} as const;

export const ANALYZER_REDIS_SCHEMA = {
  KEYS: ANALYZER_KEYS,
  FIELDS: AnalyzerFields,
} as const;

/**
 * 이넘(enum)은 런타임에선 객체로, 타입 문맥에선 멤버의 유니온 타입으로 동작.
 * 따라서, 아래 Record 키(key)로 사용된 이넘은 'analysis' | 'random_sentence' 타입.
 */
export type AnalyzerFieldType = Record<AnalyzerFields, string>;
