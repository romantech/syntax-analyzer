import { type UseMutationOptions, useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { TAnalysis } from '@/features/syntax-editor';
import { axios } from '@/lib';

export type CreateAnalysisResponse = TAnalysis;
export type CreateAnalysisPayload = {
  sentence: string[];
};

export const createAnalysis = async ({ sentence }: CreateAnalysisPayload) => {
  // Keep the request compatible with API deployments that still require a model key.
  const { data } = await axios.post<CreateAnalysisResponse>('analyzer', {
    sentence,
    model: 'fast-ft',
  });
  return data;
};

/**
 * TData : mutation 함수 실행 결과 타입
 * TError: mutation 함수 에러 타입
 * TVariables: mutation 함수 파라미터 타입
 * TContext: onMutate 콜백 함수 리턴 타입
 * */
export const CREATE_ANALYSIS_BASE_KEY = ['analysis'];

export const useCreateAnalysisMutation = (
  options?: UseMutationOptions<CreateAnalysisResponse, AxiosError, CreateAnalysisPayload>,
) => {
  return useMutation({
    mutationFn: createAnalysis,
    mutationKey: CREATE_ANALYSIS_BASE_KEY,
    ...options,
  });
};
