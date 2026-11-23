import { body, query } from 'express-validator';
import { ERROR_MESSAGES, RandomSentenceParam } from '@/constants';
import { ANALYSIS_MODEL } from '@/services';

const { MISSING_FIELD } = ERROR_MESSAGES;
const { SENT_COUNT, TOPICS, MAX_CHARS } = RandomSentenceParam;
const MAX_TOKEN_LENGTH = 80;
const MAX_TOPIC_LENGTH = 20;

const isNonBlankString = (value: unknown, maxLength: number) =>
  typeof value === 'string' &&
  value.length <= maxLength &&
  value.trim().length > 0;

/* POST /analyzer */
export const checkSentenceField = body('sentence')
  .isArray({ min: 2, max: 20 })
  .withMessage(MISSING_FIELD('sentence'))
  .bail()
  .custom((tokens: unknown[]) =>
    tokens.every((token) => isNonBlankString(token, MAX_TOKEN_LENGTH)),
  )
  .withMessage(
    `Each token must be a non-blank string of up to ${MAX_TOKEN_LENGTH} characters.`,
  );

export const checkModelField = body('model')
  .custom(
    (value: unknown) =>
      typeof value === 'string' && ANALYSIS_MODEL.includes(value),
  )
  .withMessage(
    `Invalid model value. Allowed values are '${ANALYSIS_MODEL.join(', ')}'`,
  );

const integerQuery = (
  field: RandomSentenceParam,
  defaultValue: string,
  min: number,
  max: number,
  label: string,
) => {
  const message = `${label} must be an integer between ${min} and ${max}.`;
  return query(field)
    .customSanitizer((value: unknown) =>
      value === undefined ? defaultValue : value,
    )
    .isString()
    .withMessage(message)
    .bail()
    .isInt({ min, max })
    .withMessage(message)
    .bail()
    .toInt();
};

/* GET /analyzer/random-sentences */
export const checkSentenceCountField = integerQuery(
  SENT_COUNT,
  '3',
  1,
  5,
  'Sentence count',
);

export const checkMaxCharField = integerQuery(
  MAX_CHARS,
  '80',
  10,
  80,
  'Max characters',
);

export const checkTopicsField = query(TOPICS)
  .toArray()
  .isArray({ max: 3 })
  .withMessage('A maximum of 3 topics is allowed.')
  .bail()
  .custom((topics: unknown[]) =>
    topics.every((topic) => isNonBlankString(topic, MAX_TOPIC_LENGTH)),
  )
  .withMessage(
    `Each topic must be a non-blank string of up to ${MAX_TOPIC_LENGTH} characters.`,
  );
