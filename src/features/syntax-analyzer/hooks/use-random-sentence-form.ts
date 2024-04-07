import { useState } from 'react';

import { useBoolean } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import {
  randomSentenceFormSchema,
  RandomSentenceFormValues,
  REMAINING_COUNT_BASE_KEY,
} from '@/features/syntax-analyzer';
import { useRandomSentenceQuery } from '@/features/syntax-analyzer/api';

/**
 * yup 스키마의 cast 기능을 이용해 기본값 설정
 * @see https://github.com/orgs/react-hook-form/discussions/1936
 * */
const defaultValues = randomSentenceFormSchema.cast({});
const { topics, sent_count } = defaultValues;
const defaultParams = { topics, sent_count, timeStamp: Date.now() };

export const useRandomSentenceForm = () => {
  const [readyToFetch, setReadyToFetch] = useBoolean();
  const [params, setParams] = useState(defaultParams);

  const methods = useForm<RandomSentenceFormValues>({
    defaultValues,
    resolver: yupResolver(randomSentenceFormSchema),
    reValidateMode: 'onSubmit', // 유효성 검사 시점
  });

  const { data, isFetching } = useRandomSentenceQuery(params, {
    enabled: readyToFetch,
    gcTime: 0, // 비활성화된 쿼리의 캐시 데이터는 바로 삭제
    staleTime: Infinity, // 일회성 데이터를 수동으로 조회하므로 자동 refetch 방지
    meta: { invalidateQueries: REMAINING_COUNT_BASE_KEY },
  });

  const generateSentences = async () => {
    if (!readyToFetch) setReadyToFetch.on(); // 쿼리 활성화

    const [topics, sent_count] = methods.getValues(['topics', 'sent_count']);
    // timeStamp 값이 바뀌면서 이전 쿼리키가 비활성화 되고 캐시 데이터에서 삭제됨 (gcTime 0이므로)
    setParams({ topics, sent_count, timeStamp: Date.now() });
  };

  return { methods, data, isFetching, generateSentences };
};
