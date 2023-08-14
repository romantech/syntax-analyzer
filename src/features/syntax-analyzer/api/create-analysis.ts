import { axios } from '@/lib';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { TAnalysis } from '@/features/syntax-editor';
import { AnalysisModel } from '@/features/syntax-analyzer';

export type CreateAnalysisResponse = TAnalysis;
export type CreateAnalysisPayload = {
  model: AnalysisModel;
  sentence: string[];
};

export const createAnalysis = async <
  T = CreateAnalysisResponse,
  K = CreateAnalysisPayload,
>(
  payload: K,
) => {
  const { data } = await axios.post<T>('analysis', payload);
  return data;
};

/**
 * TData : mutation 함수 실행 결과 타입
 * TError: mutation 함수 에러 타입
 * TVariables: mutation 함수 파라미터 타입
 * TContext: onMutate 콜백 함수 리턴 타입
 * */
export const CREATE_ANALYSIS_BASE_KEY = ['analysis'];

export const useCreateAnalysisMutation = <
  TData = TAnalysis,
  TVariables = CreateAnalysisPayload,
>(
  options?: UseMutationOptions<TData, AxiosError, TVariables>,
) => {
  return useMutation({
    mutationFn: createAnalysis,
    mutationKey: CREATE_ANALYSIS_BASE_KEY,
    ...options,
  });
};
