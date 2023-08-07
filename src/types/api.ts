import { Analysis, AnalysisModel } from '@/types/analysis';

/* GET analysis/remaining */
export type RemainingCountResponse = { count: number };
export type RemainingCountParam = { fingerprint: string };

/* POST /analysis */
export type CreateAnalysisResponse = Analysis;
export type CreateAnalysisPayload = {
  model: AnalysisModel;
  sentence: string[];
  fingerprint: string;
};
