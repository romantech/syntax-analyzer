import { body, query } from 'express-validator';
import { ERROR_MESSAGES, RandomSentenceParam } from '@/constants';
import { ANALYSIS_MODEL } from '@/services';

const { MISSING_FIELD } = ERROR_MESSAGES;
const { SENT_COUNT, TOPICS, MAX_CHARS } = RandomSentenceParam;

/* POST /analysis */
export const checkSentenceField = body('sentence')
  .isArray({ min: 2, max: 20 })
  .withMessage(MISSING_FIELD('sentence'));

/** GET /analysis/random-sentence */
export const checkModelField = body('model')
  .isIn(ANALYSIS_MODEL)
  .withMessage(
    `Invalid model value. Allowed values are '${ANALYSIS_MODEL.join(', ')}'`,
  );

// 생성할 영어 문장 갯수 optional
export const checkSentenceCountField = query(SENT_COUNT)
  .default(3)
  .toInt()
  .isInt({ min: 1, max: 5 })
  .withMessage('Sentence count must be between 1 and 5.');

// 주제 키워드 optional
export const checkTopicsField = query(TOPICS)
  .toArray()
  .isArray({ max: 3 })
  .withMessage('A maximum of 3 topics is allowed.');

// 각 문장의 최대 글자수 optional
export const checkMaxCharField = query(MAX_CHARS)
  .default(80)
  .toInt()
  .isInt({ min: 10, max: 80 })
  .withMessage('Max characters must be between 10 and 80.');
