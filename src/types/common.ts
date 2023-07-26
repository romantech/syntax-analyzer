import { ConstituentType } from '@/types/analysis.ts';

export type ColorMode = 'dark' | 'light';
export type ConstituentColors = {
  [key in ConstituentType]: { [key in ColorMode]: string };
};

export type Tuple<T> = [T, T];
export type NumberTuple = Tuple<number>;