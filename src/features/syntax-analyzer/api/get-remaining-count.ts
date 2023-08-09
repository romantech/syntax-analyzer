import { axios } from '@/lib';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

type RemainingCountResponse = { count: number };
export const getRemainingCount = async <T = RemainingCountResponse>() => {
  const { data } = await axios.get<T>('analysis/remaining');
  return data;
};

export const REMAINING_COUNT_BASE_KEY = ['remaining'];

/**
 * TQueryFnData: query 함수 리턴 타입
 * TError: query 함수 에러 타입
 * TData : select 함수로 쿼리 리턴값을 가공할 때 사용하는 리턴 타입
 * */
export const useRemainingCount = <
  TQueryFnData = RemainingCountResponse,
  TData = TQueryFnData,
>(
  options?: UseQueryOptions<TQueryFnData, AxiosError, TData>,
) => {
  return useQuery({
    queryKey: REMAINING_COUNT_BASE_KEY,
    queryFn: getRemainingCount,
    ...options,
  });
};