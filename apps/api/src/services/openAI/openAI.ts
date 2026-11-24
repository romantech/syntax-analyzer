import type { ChatOpenAIFields } from '@langchain/openai';
import { ANALYZER_REDIS_SCHEMA } from '@/services/redis/redisKeys';

const { FIELDS } = ANALYZER_REDIS_SCHEMA;

const FINE_TUNE_SUFFIX = '_fine_tuned';

/** 클라이언트 요청과 일치 */
export enum AIModelKey {
  FAST = 'fast',
  PRIMARY = 'primary',
  FAST_FT = 'fast-ft',
  PRIMARY_FT = 'primary-ft',
}

export const ANALYSIS_MODEL_OPTION = {
  [AIModelKey.PRIMARY]: {
    promptField: FIELDS.ANALYSIS,
    temperature: 0.6,
  },
  [AIModelKey.PRIMARY_FT]: {
    promptField: FIELDS.ANALYSIS + FINE_TUNE_SUFFIX,
    temperature: 0.6,
  },
  [AIModelKey.FAST_FT]: {
    promptField: FIELDS.ANALYSIS + FINE_TUNE_SUFFIX,
    temperature: 0.6,
  },
} as const;

export const RANDOM_SENTENCE_CONFIG = {
  temperature: 1,
  reasoning: { effort: 'low' },
} satisfies ChatOpenAIFields;

export const ANALYSIS_MODEL = Object.keys(ANALYSIS_MODEL_OPTION);
export type AnalysisModel = keyof typeof ANALYSIS_MODEL_OPTION;
