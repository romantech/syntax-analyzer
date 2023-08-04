import {
  QueryOptions,
  RemainingCountParam,
  RemainingCountResponse,
} from '@/types/api';
import { useQuery } from 'react-query';
import { AxiosError } from 'axios';
import { getRemainingCount } from '@/api/analysisAPI';
import { factoryQueryKeyGenerator } from '@/utils/identifier';

export const remainingCountBaseKey = ['remaining'];
const keyGenerator = factoryQueryKeyGenerator(remainingCountBaseKey);
const remainingCountQueryKey = (param: string) => keyGenerator([param]);

export default function useRemainingCountQuery<
  T = RemainingCountResponse,
  K = T,
>(params: RemainingCountParam, options?: QueryOptions<T, K>) {
  return useQuery<T, AxiosError, K>(
    remainingCountQueryKey(params.fingerprint),
    () => getRemainingCount(params),
    options,
  );
}
