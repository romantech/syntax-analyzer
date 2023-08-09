import { atom } from 'jotai';
import { atomWithReset, atomWithStorage, RESET } from 'jotai/utils';
import {
  ConstituentWithoutId,
  hasAddedTagAtom,
} from '@/features/syntax-editor';
import {
  DEFAULT_ABBR_INFO_MODE,
  DEFAULT_TAG_INFO_MODE,
} from '@/features/syntax-editor/constants/settings';

export const selectedTagAtom = atomWithReset<ConstituentWithoutId | null>(null);
export const hoveredConstituentAtom = atomWithReset<number | null>(null);
export const deleteModeAtom = atomWithReset(false);

/** 로컬 스토리지에서 키 값을 먼저 찾고 없다면 두번째 인자에 명시한 초기값으로 설정 */
export const tagInfoModeAtom = atomWithStorage(
  'tagInfoMode',
  DEFAULT_TAG_INFO_MODE,
);
export const abbrInfoModeAtom = atomWithStorage(
  'abbrInfoMode',
  DEFAULT_ABBR_INFO_MODE,
);

export const resetControlPanelAtom = atom(null, (get, set) => {
  set(selectedTagAtom, RESET);
  set(hoveredConstituentAtom, RESET);
  set(deleteModeAtom, RESET);
});

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
