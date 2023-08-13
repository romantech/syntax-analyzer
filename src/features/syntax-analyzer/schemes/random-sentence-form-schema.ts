import * as yup from 'yup';
import { englishInputSchema } from './english-sentence-schema';

export const randomSentenceFormSchema = yup.object({
  sent_count: yup
    .number()
    .integer('정수만 입력할 수 있어요')
    .min(1, '최소 1')
    .max(5, '최대 5')
    .required()
    .default(() => 3),
  topics: yup
    .array()
    .required()
    .of(englishInputSchema.required())
    .max(3, '키워드는 최대 3개까지만 허용돼요')
    .test('unique', '키워드는 중복될 수 없어요', (list) => {
      return list.length === new Set(list).size;
    })
    .default(() => []),
});
