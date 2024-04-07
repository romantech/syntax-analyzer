import * as yup from 'yup';

import {
  DEFAULT_PICKER_COUNT,
  MAX_PICKER_SENTENCE,
  MAX_TOPIC_ADDITION,
  MAX_TOPIC_LENGTH,
  MIN_PICKER_SENTENCE,
  MIN_TOPIC_LENGTH,
} from '@/features/syntax-analyzer/constants';

import { englishInputSchema } from './english-sentence-schema';

const keywordSchema = englishInputSchema
  .lowercase()
  .min(MIN_TOPIC_LENGTH, `최소 ${MIN_TOPIC_LENGTH}자 이상 입력 해주세요`)
  .max(MAX_TOPIC_LENGTH, `최대 ${MAX_TOPIC_LENGTH}자 까지 입력할 수 있어요`)
  .ensure(); // 기본값 빈 문자열로 설정하고 null/undefined 는 빈 문자열로 변환

const topicsSchema = yup
  .array()
  .required()
  .of(keywordSchema.required())
  .max(
    MAX_TOPIC_ADDITION,
    `키워드는 최대 ${MAX_TOPIC_ADDITION}개까지 추가할 수 있어요`,
  )
  .test('unique', '키워드는 중복될 수 없어요', (list) => {
    return list.length === new Set(list).size;
  })
  .ensure(); // 기본값 빈 배열로 설정하고 null/undefined 는 빈 배열로 변환

export const randomSentenceFormSchema = yup.object({
  sent_count: yup
    .number()
    .positive(`최소 ${MIN_PICKER_SENTENCE}개 문장`)
    .max(MAX_PICKER_SENTENCE, `최대 ${MAX_PICKER_SENTENCE}개 문장`)
    .required()
    .default(() => DEFAULT_PICKER_COUNT),
  topics: topicsSchema,
  keyword: keywordSchema,
});

export const addTopicSchema = randomSentenceFormSchema.pick([
  'keyword',
  'topics',
]);

export type RandomSentenceFormValues = yup.InferType<
  typeof randomSentenceFormSchema
>;
