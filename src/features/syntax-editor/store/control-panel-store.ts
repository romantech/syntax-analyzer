import { atom } from 'jotai';
import { atomWithReset, atomWithStorage, RESET } from 'jotai/utils';

import type { NumberTuple } from '@/base';
import { type ConstituentWithoutId, hasAddedTagAtom } from '@/features/syntax-editor';
import { DEFAULT_ABBR_INFO_MODE, DEFAULT_TAG_INFO_MODE } from '@/features/syntax-editor/constants';

export const selectedTagAtom = atomWithReset<ConstituentWithoutId | null>(null);
export const hoveredConstituentAtom = atomWithReset<number | null>(null);
export const deleteModeAtom = atomWithReset(false);
export const selectedTokenRangeAtom = atomWithReset<NumberTuple | null>(null);

/** 로컬 스토리지에서 키 값을 먼저 찾고 없다면 두번째 인자에 명시한 초기값으로 설정 */
export const tagInfoModeAtom = atomWithStorage('tagInfoMode', DEFAULT_TAG_INFO_MODE);
export const abbrInfoModeAtom = atomWithStorage('abbrInfoMode', DEFAULT_ABBR_INFO_MODE);

export const resetControlPanelAtom = atom(null, (_get, set) => {
  set(selectedTagAtom, RESET);
  set(hoveredConstituentAtom, RESET);
  set(deleteModeAtom, RESET);
  set(selectedTokenRangeAtom, RESET);
});

export const isDisableDeleteButtonAtom = atom((get) => !get(hasAddedTagAtom));

export const toggleDeleteModeActionAtom = atom(
  (get) => get(deleteModeAtom),
  (get, set) => {
    const current = get(deleteModeAtom);
    set(deleteModeAtom, !current);
    set(selectedTagAtom, null);
    set(selectedTokenRangeAtom, RESET);
  },
);

export const selectedTagActionAtom = atom(
  (get) => get(selectedTagAtom),
  (get, set, constituent: ConstituentWithoutId | null) => {
    const isDeleteMode = get(deleteModeAtom);
    if (isDeleteMode) set(deleteModeAtom, false);
    set(selectedTagAtom, constituent);
    set(selectedTokenRangeAtom, RESET);
  },
);

export const isAbbrTooltipVisibleAtom = atom((get) => {
  const isAbbrInfoMode = get(abbrInfoModeAtom);
  const isDeleteMode = get(deleteModeAtom);
  return isAbbrInfoMode && !isDeleteMode;
});
