import { ColorMode } from '@/base';

export type ConstituentType = 'clause' | 'phrase' | 'token' | 'token-group';

type ConstituentDataSetKey =
  | 'constituentLabel'
  | 'constituentId'
  | 'constituentAbbr'
  | 'tokenIndex';

export type ConstituentDataSet = { [key in ConstituentDataSetKey]?: string };

export type ConstituentColors = {
  [key in ConstituentType]: { [key in ColorMode]: string };
};

export type TConstituent = {
  id: number; // Random 9-digit number
  elementId: number; // Constituent ID
  label: string; // Grammatical label, e.g., "subject"
  abbreviation: string; // Abbreviation, e.g., "s"
  type: ConstituentType; // Type of constituent
  comment?: string; // Optional commentary
};

export type ConstituentWithoutId = Omit<TConstituent, 'id'>;
