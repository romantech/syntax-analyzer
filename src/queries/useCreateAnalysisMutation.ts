import { Analysis, CreateAnalysisPayload } from '@/types/analysis';
import { MutationOptions } from '@/types/api';
import { useMutation } from 'react-query';
import { AxiosError } from 'axios';
import { createAnalysis } from '@/api/analysisAPI';

export default function useCreateAnalysisMutation<
  T = Analysis,
  K = CreateAnalysisPayload,
>(options?: MutationOptions<T, K>) {
  return useMutation<T, AxiosError, K>(
    (formValues) => createAnalysis(formValues),
    options,
  );
}
