import { useAtomValue, useSetAtom } from 'jotai';
import {
  segmentHistoryIndexAtom,
  undoRedoAbilityAtom,
} from '@/store/segmentHistoryStore';
import { IconButton } from '@chakra-ui/react';
import { ImUndo } from 'react-icons/im';

export default function UndoButton() {
  const { canUndo } = useAtomValue(undoRedoAbilityAtom);
  const setSegmentHistoryIndex = useSetAtom(segmentHistoryIndexAtom);
  return (
    <IconButton
      variant="solid"
      aria-label="Undo the last action"
      icon={<ImUndo />}
      isDisabled={!canUndo}
      onClick={() => setSegmentHistoryIndex((prev) => prev - 1)}
    />
  );
}
