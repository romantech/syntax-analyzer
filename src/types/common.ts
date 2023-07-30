import { ConstituentType } from '@/types/analysis';

export type ColorMode = 'dark' | 'light';
export type ConstituentColors = {
  [key in ConstituentType]: { [key in ColorMode]: string };
};

export type Tuple<T> = [T, T];
export type NumberTuple = Tuple<number>;
export type Nullable<T> = T | null;
export type VoidFunc<T = void> = (...args: T[]) => void;
