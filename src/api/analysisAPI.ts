import axios from 'axios';
import { RemainingCountParam, RemainingCountResponse } from '@/types/api';
import { Analysis, CreateAnalysisPayload } from '@/types/analysis';

const baseURL = import.meta.env.DEV
  ? import.meta.env.VITE_API_BASE_URL_DEV
  : import.meta.env.VITE_API_BASE_URL_PROD;

const analysisInstance = axios.create({ baseURL });

export const getRemainingCount = async <
  T = RemainingCountResponse,
  K = RemainingCountParam,
>(
  params: K,
) => {
  const { data } = await analysisInstance.get<T>('analysis/remaining', {
    params,
  });
  return data;
};

export const createAnalysis = async <T = Analysis, K = CreateAnalysisPayload>(
  payload: K,
) => {
  const { data } = await analysisInstance.post<T>('analysis', payload);
  return data;
};
