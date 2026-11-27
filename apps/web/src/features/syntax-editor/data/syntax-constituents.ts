import { SYNTAX_CONSTITUENTS as catalog } from 'syntax-analyzer-shared/syntax-constituents.js';
import type { ConstituentType, ConstituentWithoutId } from '@/features/syntax-editor';

export const SYNTAX_CONSTITUENTS: readonly ConstituentWithoutId[] = catalog;

type ConstituentGroup = { [key in ConstituentType]: ConstituentWithoutId[] };
export const groupedConstituentsByType = SYNTAX_CONSTITUENTS.reduce((group, constituent) => {
  if (!group[constituent.type]) group[constituent.type] = [];
  group[constituent.type].push(constituent);
  return group;
}, {} as ConstituentGroup);
