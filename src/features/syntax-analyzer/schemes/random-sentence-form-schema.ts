import * as yup from 'yup';
import { englishInputSchema } from './english-sentence-schema';
import { MAX_TOPICS } from '@/features/syntax-analyzer';

const keywordSchema = englishInputSchema
  .lowercase()
  .min(2, '최소 2글자 이상 입력 해주세요')
  .max(20, '최대 20글자 까지 입력할 수 있어요')
  .ensure(); // 기본값 빈 문자열로 설정하고 null/undefined 는 빈 문자열로 변환

const topicsSchema = yup
  .array()
  .required()
  .of(keywordSchema.required())
  .max(3, `키워드는 최대 ${MAX_TOPICS}개까지 추가할 수 있어요`)
  .test('unique', '키워드는 중복될 수 없어요', (list) => {
    return list.length === new Set(list).size;
  })
  .ensure(); // 기본값 빈 배열로 설정하고 null/undefined 는 빈 배열로 변환

export const randomSentenceFormSchema = yup.object({
  sent_count: yup
    .number()
    .positive('최소 1개 문장')
    .max(5, '최대 5개 문장')
    .required()
    .default(() => 3),
  topics: topicsSchema,
  keyword: keywordSchema,
});

export const addTopicSchema = randomSentenceFormSchema.pick([
  'keyword',
  'topics',
]);
