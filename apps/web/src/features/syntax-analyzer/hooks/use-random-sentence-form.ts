import { useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  DEFAULT_PICKER_COUNT,
  MAX_PICKER_SENTENCE,
  MIN_PICKER_SENTENCE,
} from '@/features/syntax-analyzer/constants';
import { useRandomSentenceQuery } from '../api/get-random-sentences';
import { REMAINING_COUNT_BASE_KEY } from '../api/get-remaining-counts';
import { randomSentenceFormSchema } from '../schemes/random-sentence-form-schema';

/**
 * yup 스키마의 cast 기능을 이용해 기본값 설정
 * @see https://github.com/orgs/react-hook-form/discussions/1936
 * */
const defaultValues = randomSentenceFormSchema.cast({});
const { topics, sent_count } = defaultValues;
const defaultParams = { topics, sent_count, timeStamp: Date.now() };

export const useRandomSentenceForm = () => {
  const [readyToFetch, setReadyToFetch] = useState(false);
  const [params, setParams] = useState(defaultParams);

  const methods = useForm({ defaultValues });

  const { data, isFetching } = useRandomSentenceQuery(params, {
    enabled: readyToFetch,
    gcTime: 0, // 비활성화된 쿼리의 캐시 데이터는 바로 삭제
    staleTime: Infinity, // 일회성 데이터를 수동으로 조회하므로 자동 refetch 방지
    meta: { invalidateQueries: REMAINING_COUNT_BASE_KEY },
  });

  const generateSentences = () => {
    const [topics, inputCount] = methods.getValues(['topics', 'sent_count']);
    const count = Number.isFinite(inputCount)
      ? Math.min(MAX_PICKER_SENTENCE, Math.max(MIN_PICKER_SENTENCE, Math.trunc(inputCount)))
      : DEFAULT_PICKER_COUNT;
    methods.setValue('sent_count', count);
    setReadyToFetch(true);
    // timeStamp 값이 바뀌면서 이전 쿼리키가 비활성화 되고 캐시 데이터에서 삭제됨 (gcTime 0이므로)
    setParams({ topics, sent_count: count, timeStamp: Date.now() });
  };

  return { methods, data, isFetching, generateSentences };
};
