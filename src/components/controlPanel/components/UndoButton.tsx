import { useAtomValue, useSetAtom } from 'jotai';
import {
  segmentHistoryIndexAtom,
  undoRedoAbilityAtom,
} from '@/store/segmentHistoryStore.ts';
import { IconButton } from '@chakra-ui/react';
import { ImUndo } from 'react-icons/im';

const UndoButton = () => {
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
};

export default UndoButton;
