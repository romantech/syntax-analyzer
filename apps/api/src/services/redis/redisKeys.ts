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
    BROWSER: (id: string) => `${Namespace.ANALYZER}:remaining:browser:${id}`,
    IP: (ip: string) => `${Namespace.ANALYZER}:remaining:ip:${ip}`,
    RESERVATION: (id: string) => {
      return `${Namespace.ANALYZER}:remaining:reservation:${id}` as const;
    },
  },
  PROMPT: `${Namespace.ANALYZER}:prompt`,
} as const;

export const ANALYZER_REDIS_SCHEMA = {
  KEYS: ANALYZER_KEYS,
  FIELDS: AnalyzerFields,
} as const;
