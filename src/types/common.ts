import { ConstituentType } from '@/types/analysis.ts';

export type ColorMode = 'dark' | 'light';
export type ConstituentColors = {
  [key in ConstituentType]: { [key in ColorMode]: string };
};
