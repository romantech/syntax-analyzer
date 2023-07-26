import { atom } from 'jotai';

export const tagInfoModeAtom = atom(true);
export const abbrInfoModeAtom = atom(false);
export const deleteModeAtom = atom(false);

export const shouldOpenAbbrTooltipAtom = atom((get) => {
  const isAbbrInfoMode = get(abbrInfoModeAtom);
  const isDeleteMode = get(deleteModeAtom);
  return isAbbrInfoMode && !isDeleteMode;
});
