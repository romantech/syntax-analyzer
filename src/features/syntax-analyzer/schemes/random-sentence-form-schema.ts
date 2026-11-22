import * as yup from 'yup';

import {
  DEFAULT_PICKER_COUNT,
  MAX_TOPIC_ADDITION,
  MAX_TOPIC_LENGTH,
  MIN_TOPIC_LENGTH,
} from '@/features/syntax-analyzer/constants';

import { englishInputSchema } from './english-sentence-schema';

const keywordSchema = englishInputSchema
  .lowercase()
  .min(MIN_TOPIC_LENGTH, 'validation.keywordMin')
  .max(MAX_TOPIC_LENGTH, 'validation.keywordMax')
  .ensure(); // 기본값 빈 문자열로 설정하고 null/undefined 는 빈 문자열로 변환

const topicsSchema = yup
  .array()
  .required()
  .of(keywordSchema.required('validation.keywordRequired'))
  .max(MAX_TOPIC_ADDITION, 'validation.topicMax')
  .test('unique', 'validation.topicDuplicate', (list) => {
    return list.length === new Set(list).size;
  })
  .ensure(); // 기본값 빈 배열로 설정하고 null/undefined 는 빈 배열로 변환

export const randomSentenceFormSchema = yup.object({
  sent_count: yup.number().required().default(DEFAULT_PICKER_COUNT),
  topics: topicsSchema,
  keyword: keywordSchema,
});

export const addTopicSchema = randomSentenceFormSchema.pick(['keyword', 'topics']);

export type RandomSentenceFormValues = yup.InferType<typeof randomSentenceFormSchema>;
