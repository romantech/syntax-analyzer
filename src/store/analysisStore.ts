import { atom } from 'jotai';
import { Constituent } from '@/types/analysis.ts';

export const selectedTagAtom = atom<Constituent | null>(null);
