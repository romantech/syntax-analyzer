import axios from 'axios';
import { RemainingCountParam, RemainingCountResponse } from '@/types/api';

const baseURL = import.meta.env.DEV
  ? import.meta.env.VITE_API_BASE_URL_DEV
  : import.meta.env.VITE_API_BASE_URL_PROD;

const analysisInstance = axios.create({ baseURL });

export const getRemainingCount = async <
  T = RemainingCountResponse,
  K = RemainingCountParam,
>(
  fingerprint?: K,
) => {
  const { data } = await analysisInstance.get<T>('analysis/remaining', {
    params: { fingerprint },
  });
  return data;
};
