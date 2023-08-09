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
  id: number; // A random 9-digit number
  elementId: number; // Constituent ID with a fixed value
  label: string; // Grammatical constituent name in lowercase
  abbreviation: string; // Abbreviated constituent name in lowercase
  type: ConstituentType; // Constituent type
  comment?: string; // Optional comment
};

export type ConstituentWithoutId = Omit<TConstituent, 'id'>;
