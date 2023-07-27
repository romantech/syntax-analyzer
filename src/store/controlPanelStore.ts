import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { ConstituentWithoutId } from '@/types/analysis';

export const selectedTagAtom = atom<ConstituentWithoutId | null>(null);
export const hoveredConstituentAtom = atom<number | null>(null);

export const tagInfoModeAtom = atomWithStorage('tagInfoMode', true);
export const abbrInfoModeAtom = atomWithStorage('abbrInfoMode', false);
export const deleteModeAtom = atom(false);

export const toggleDeleteModeActionAtom = atom(
  (get) => get(deleteModeAtom),
  (get, set) => {
    const current = get(deleteModeAtom);
    set(deleteModeAtom, !current);
    set(selectedTagAtom, null);
  },
);

export const selectedTagActionAtom = atom(
  (get) => get(selectedTagAtom),
  (get, set, value: ConstituentWithoutId | null) => {
    const isDeleteMode = get(deleteModeAtom);
    if (isDeleteMode) set(deleteModeAtom, false);
    set(selectedTagAtom, value);
  },
);

export const isAbbrTooltipVisibleAtom = atom((get) => {
  const isAbbrInfoMode = get(abbrInfoModeAtom);
  const isDeleteMode = get(deleteModeAtom);
  return isAbbrInfoMode && !isDeleteMode;
});
