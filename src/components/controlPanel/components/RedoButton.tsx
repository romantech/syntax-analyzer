import { useAtomValue, useSetAtom } from 'jotai';
import {
  segmentHistoryIndexAtom,
  undoRedoAbilityAtom,
} from '@/store/segmentHistoryStore.ts';
import { IconButton } from '@chakra-ui/react';
import { ImRedo } from 'react-icons/im';

const RedoButton = () => {
  const { canRedo } = useAtomValue(undoRedoAbilityAtom);
  const setSegmentHistoryIndex = useSetAtom(segmentHistoryIndexAtom);
  return (
    <IconButton
      variant="solid"
      aria-label="Redo the last undone action"
      icon={<ImRedo />}
      isDisabled={!canRedo}
      onClick={() => setSegmentHistoryIndex((prev) => prev + 1)}
    />
  );
};

export default RedoButton;
