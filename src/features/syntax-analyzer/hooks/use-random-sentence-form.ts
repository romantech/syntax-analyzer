import { useBoolean } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { useLocalStorage } from '@/base';
import {
  randomSentenceFormSchema,
  REMAINING_COUNT_BASE_KEY,
} from '@/features/syntax-analyzer';
import { useRandomSentenceQuery } from '@/features/syntax-analyzer/api';

export type RandomSentenceFormValues = {
  sent_count: number; // 생성할 랜덤 문장 개수
  topics: string[];
  keyword: string;
};

/**
 * yup 스키마의 cast 기능을 이용해 기본값 설정
 * @see https://github.com/orgs/react-hook-form/discussions/1936
 * */
const defaultFormValues = randomSentenceFormSchema.cast({});
const { topics, sent_count } = defaultFormValues;
const defaultParams = { topics, sent_count, timeStamp: Date.now() };

export const useRandomSentenceForm = () => {
  const [readyToFetch, setReadyToFetch] = useBoolean();

  const [params, setParams] = useLocalStorage(
    'random-sentence-params',
    defaultParams, // 기본값을 넘겼어도 로컬 스토리지에 key 값이 있으면 해당 값 사용
  );

  const methods = useForm<RandomSentenceFormValues>({
    defaultValues: {
      ...defaultFormValues,
      topics: params.topics, // 로컬 스토리지에 있는 값을 기본값으로 설정
      sent_count: params.sent_count,
    },
    resolver: yupResolver(randomSentenceFormSchema),
    reValidateMode: 'onSubmit',
  });

  const { data, isFetching } = useRandomSentenceQuery(params, {
    enabled: readyToFetch,
    gcTime: 0, // 비활성화된 쿼리의 캐시 데이터는 바로 삭제
    staleTime: Infinity, // 일회성 데이터를 수동으로 조회하므로 자동 refetch 방지
    meta: { invalidateQueries: REMAINING_COUNT_BASE_KEY },
  });

  const generateSentences = async () => {
    if (!readyToFetch) setReadyToFetch.on(); // 쿼리 활성화

    const { topics, sent_count } = methods.getValues();
    // timeStamp 값이 바뀌면서 이전 쿼리키가 비활성화 되고 캐시 데이터에서 삭제됨 (gcTime 0이므로)
    setParams({ topics, sent_count, timeStamp: Date.now() });
  };

  return { methods, data, isFetching, generateSentences };
};
