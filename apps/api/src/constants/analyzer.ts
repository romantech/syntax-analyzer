import { z } from 'zod';
import { AIModelKey } from '@/services';

export const ANALYSIS_DECREMENT_COUNT = {
  [AIModelKey.FAST]: 1,
  [AIModelKey.PRIMARY]: 2,
  [AIModelKey.FAST_FT]: 1,
  [AIModelKey.PRIMARY_FT]: 2,
};

export enum RandomSentenceParam {
  SENT_COUNT = 'sent_count',
  TOPICS = 'topics',
  MAX_CHARS = 'max_chars',
}

export interface RandomSentenceParams {
  /** 생성할 영어 문장 개수 */
  [RandomSentenceParam.SENT_COUNT]: number;
  /** 주제 키워드 */
  [RandomSentenceParam.TOPICS]: string[];
  /** 각 문장의 최대 글자 수 */
  [RandomSentenceParam.MAX_CHARS]: number;
}

export const sentencesSchema = z.object({
  sentences: z.array(z.string()).describe('sentences'),
});
