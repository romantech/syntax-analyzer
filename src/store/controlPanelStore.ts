import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { ConstituentWithoutId } from '@/types/analysis';
import { hasAddedTagAtom } from '@/store/segmentHistoryStore.ts';

export const selectedTagAtom = atom<ConstituentWithoutId | null>(null);
export const hoveredConstituentAtom = atom<number | null>(null);

/** 로컬 스토리지에서 키 값을 먼저 찾고 없다면 두번째 인자에 명시한 초기값으로 설정 */
export const tagInfoModeAtom = atomWithStorage('tagInfoMode', true);
export const abbrInfoModeAtom = atomWithStorage('abbrInfoMode', false);

export const deleteModeAtom = atom(false);

export const isDisableDeleteButtonAtom = atom((get) => !get(hasAddedTagAtom));

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
  (get, set, constituent: ConstituentWithoutId | null) => {
    const isDeleteMode = get(deleteModeAtom);
    if (isDeleteMode) set(deleteModeAtom, false);
    set(selectedTagAtom, constituent);
  },
);

export const isAbbrTooltipVisibleAtom = atom((get) => {
  const isAbbrInfoMode = get(abbrInfoModeAtom);
  const isDeleteMode = get(deleteModeAtom);
  return isAbbrInfoMode && !isDeleteMode;
});
