import { useAtomValue, useSetAtom } from 'jotai';
import {
  segmentHistoryIndexAtom,
  undoRedoAbilityAtom,
} from '@/store/segmentHistoryStore';
import { IconButton } from '@chakra-ui/react';
import { ImRedo } from 'react-icons/im';

export default function RedoButton() {
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
}
