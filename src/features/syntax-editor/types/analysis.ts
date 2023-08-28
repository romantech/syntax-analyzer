import { TConstituent } from '@/features/syntax-editor';
import { ISODateString } from '@/base';

export type AnalysisSource = 'user' | 'sample';

export type TSegment = {
  id: number; // Random 9-digit number
  begin: number; // Start index
  end: number; // End  index
  constituents: TConstituent[]; // Segment constituents
  children: TSegment[]; // Sub-segments
};

export type TAnalysis = {
  id: string; // Random 21-byte string
  source: AnalysisSource; // Data source
  createdAt: ISODateString; // ISO 8601 timestamp
  sentence: string[]; // Tokenized sentence
  rootSegment: TSegment; // Root segment
  isAnalyzedByGPT: boolean; // AI-analyzed status
};

export type CombinedAnalysisList = { [key in AnalysisSource]: TAnalysis[] };

export type AnalysisPathParams = { source: AnalysisSource; index: string };
