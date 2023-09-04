import { QueryClient, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { axios } from '@/lib';

export type RemainingCountResponse = {
  analysis: number;
  random_sentence: number;
};
export const getRemainingCounts = async <T = RemainingCountResponse>() => {
  const { data } = await axios.get<T>('analyzer/remaining-counts');
  return data;
};

export const REMAINING_COUNT_BASE_KEY = ['remaining-counts'];

/**
 * TQueryFnData: query 함수 리턴 타입
 * TError: query 함수 에러 타입
 * TData : select 함수로 쿼리 리턴값을 가공할 때 사용하는 리턴 타입
 * */
export const useRemainingCountQuery = <
  TQueryFnData = RemainingCountResponse,
  TData = TQueryFnData,
>(
  options?: UseQueryOptions<TQueryFnData, AxiosError, TData>,
) => {
  return useQuery({
    queryKey: REMAINING_COUNT_BASE_KEY,
    queryFn: getRemainingCounts,
    ...options,
  });
};

/**
 * React Router loader 사용시 활용
 * @see https://reactrouter.com/en/main/guides/data-libs
 * */
export const analysisCountLoader = (queryClient: QueryClient) => {
  return () => {
    return queryClient.fetchQuery(REMAINING_COUNT_BASE_KEY, getRemainingCounts);
  };
};
