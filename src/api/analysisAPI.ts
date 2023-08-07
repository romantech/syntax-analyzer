import axios from 'axios';
import {
  CreateAnalysisPayload,
  CreateAnalysisResponse,
  RemainingCountResponse,
} from '@/types/api';

const baseURL = import.meta.env.DEV
  ? import.meta.env.VITE_API_BASE_URL_DEV
  : import.meta.env.VITE_API_BASE_URL_PROD;

const analysisInstance = axios.create({ baseURL });

export const getRemainingCount = async <T = RemainingCountResponse>() => {
  const { data } = await analysisInstance.get<T>('analysis/remaining');
  return data;
};

export const createAnalysis = async <
  T = CreateAnalysisResponse,
  K = CreateAnalysisPayload,
>(
  payload: K,
) => {
  const { data } = await analysisInstance.post<T>('analysis', payload);
  return data;
};
