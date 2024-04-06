import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { RandomSentenceFormValues } from '@/features/syntax-analyzer';
import { axios, paramsSerializer } from '@/lib';

type RandomSentenceResponse = string[];
type RandomSentenceParams = Omit<RandomSentenceFormValues, 'keyword'>;

export const getRandomSentences = async <
  T = RandomSentenceResponse,
  K = RandomSentenceParams,
>(
  params: K,
) => {
  const { data } = await axios.get<T>('analyzer/random-sentences', {
    params,
    paramsSerializer,
  });
  return data;
};

export const RANDOM_SENTENCE_BASE_KEY = ['random-sentences'] as const;

export const useRandomSentenceQuery = <T = RandomSentenceResponse, K = T>(
  params: RandomSentenceParams,
  options?: Partial<UseQueryOptions<T, AxiosError, K>>,
) => {
  return useQuery({
    queryKey: [...RANDOM_SENTENCE_BASE_KEY, params],
    queryFn: () => {
      const { sent_count, topics } = params;
      return getRandomSentences<T>({ sent_count, topics });
    },
    ...options,
  });
};
