import type { UseMutationOptions, UseQueryOptions } from 'react-query';
import type { AxiosError } from 'axios';

/**
 * TQueryFnData: query 함수 리턴 타입
 * TError: query 함수 에러 타입
 * TData : select 함수로 쿼리 리턴값을 가공할 때 사용하는 리턴 타입
 * */
export type QueryOptions<TQueryFnData, TData = TQueryFnData> = UseQueryOptions<
  TQueryFnData,
  AxiosError,
  TData
>;

/**
 * TData : mutation 함수 실행 결과 타입
 * TError: mutation 함수 에러 타입
 * TVariables: mutation 함수 파라미터 타입
 * TContext: onMutate 콜백 함수 리턴 타입
 * */
export type MutationOptions<TData, TVariables> = UseMutationOptions<
  TData,
  AxiosError,
  TVariables
>;

export type RemainingCountResponse = { count: number };
export type RemainingCountParam = { fingerprint: string };
