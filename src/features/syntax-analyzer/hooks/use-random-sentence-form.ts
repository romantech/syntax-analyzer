import { randomSentenceFormSchema } from '@/features/syntax-analyzer';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRandomSentenceQuery } from '@/features/syntax-analyzer/api';
import { useState } from 'react';
import { useBoolean } from '@chakra-ui/react';

export type RandomSentenceFormValues = {
  sent_count: number; // 생성할 랜덤 문장 개수
  topics: string[];
  keyword: string;
};

/**
 * yup 스키마의 cast 기능을 이용해 기본값 설정
 * @see https://github.com/orgs/react-hook-form/discussions/1936
 * */
const defaultValues = randomSentenceFormSchema.cast({});
const { keyword, ...rest } = defaultValues;
const defaultParams = { ...rest, timestamp: Date.now() };

export const useRandomSentenceForm = () => {
  const [params, setParams] = useState(defaultParams);
  const [readyToFetch, setReadyToFetch] = useBoolean();

  const methods = useForm<RandomSentenceFormValues>({
    defaultValues,
    resolver: yupResolver(randomSentenceFormSchema),
    reValidateMode: 'onSubmit',
  });

  /** 매번 다른 랜덤 문장을 불러와야 하므로 캐시 비활성 */
  const { data, isFetching } = useRandomSentenceQuery(params, {
    enabled: readyToFetch,
    cacheTime: 0,
  });

  /**
   * 요청할 때마다 새로운 랜덤 문장을 생성해야 하기 때문에,
   * timestamp 속성을 추가해서 매번 다른 쿼리키를 받는 것처럼 작성
   * */
  const generateSentences = () => {
    const { topics, sent_count } = methods.getValues();
    setParams({ topics, sent_count, timestamp: Date.now() });

    if (!readyToFetch) setReadyToFetch.on();
  };

  return { methods, data, isFetching, generateSentences };
};
