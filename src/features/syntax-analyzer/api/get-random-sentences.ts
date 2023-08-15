import { axios, paramsSerializer } from '@/lib';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { RandomSentenceFormValues } from '@/features/syntax-analyzer';

type RandomSentenceResponse = string[];
type RandomSentenceParams = Omit<RandomSentenceFormValues, 'keyword'>;

export const getRandomSentences = async <T = RandomSentenceResponse>({
  sent_count,
  topics,
}: RandomSentenceParams) => {
  const { data } = await axios.get<T>('analyzer/random-sentences', {
    params: { sent_count, topics },
    paramsSerializer,
  });
  return data;
};

export const RANDOM_SENTENCE_BASE_KEY = ['random-sentences'] as const;

export const useRandomSentenceQuery = <T = RandomSentenceResponse, K = T>(
  params: RandomSentenceParams & { timestamp?: number },
  options?: UseQueryOptions<T, AxiosError, K>,
) => {
  return useQuery({
    queryKey: [...RANDOM_SENTENCE_BASE_KEY, params],
    queryFn: () => getRandomSentences<T>(params),
    ...options,
  });
};
