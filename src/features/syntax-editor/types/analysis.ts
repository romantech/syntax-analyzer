import { TConstituent } from '@/features/syntax-editor';

export type AnalysisSource = 'user' | 'sample';

export type TSegment = {
  id: number; // A random 9-digit number
  begin: number; // Start token index
  end: number; // End token index
  constituents: TConstituent[]; // Can be empty
  children: TSegment[]; // Can be empty
};

export type TAnalysis = {
  id: string; // A random string of 21 bytes
  source: AnalysisSource; // Source of the sentence
  createdAt: string; // Timestamp in ISO 8601 format
  sentence: string[]; // Tokenized sentence
  rootSegment: TSegment; // The array contains only a single root segment
};

export type CombinedAnalysisList = { [key in AnalysisSource]: TAnalysis[] };

export type AnalysisPathParams = { source: AnalysisSource; index: string };
