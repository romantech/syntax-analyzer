import { useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

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
const defaultValues = randomSentenceFormSchema.cast({});
const { topics, sent_count } = defaultValues;

export const useRandomSentenceForm = () => {
  const [params, setParams] = useState({ topics, sent_count });

  const methods = useForm<RandomSentenceFormValues>({
    defaultValues,
    resolver: yupResolver(randomSentenceFormSchema),
    reValidateMode: 'onSubmit',
  });

  // 쿼리가 비활성화 되자마자 캐시를 삭제하고 싶으면 gcTime 쿼리 옵션을 0으로 설정
  // 캐시 데이터가 있다면 쿼리가 활성화 됐을 때(마운트 등) 캐시 데이터 사용(staleTime 초과됐다면 리패치)
  const { data, isFetching, refetch } = useRandomSentenceQuery(params, {
    enabled: false, // 생성 버튼을 클릭했을 때만 수동으로 데이터 조회하므로 false로 설정
    staleTime: Infinity, // 데이터를 수동으로 조회하므로 자동 refetch 방지
    meta: { invalidateQueries: REMAINING_COUNT_BASE_KEY },
  });

  const generateSentences = async () => {
    const { topics, sent_count } = methods.getValues();
    setParams({ topics, sent_count });
    await refetch();
  };

  return { methods, data, isFetching, generateSentences };
};
