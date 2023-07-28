import { undoRedoActionAtom } from '@/store/segmentHistoryStore';
import { IconButton } from '@chakra-ui/react';
import { ImUndo } from 'react-icons/im';
import { useAtom } from 'jotai';

export default function UndoButton() {
  const [actionable, action] = useAtom(undoRedoActionAtom);
  return (
    <IconButton
      variant="solid"
      aria-label="Undo the last action"
      icon={<ImUndo />}
      isDisabled={!actionable.undo}
      onClick={() => action('undo')}
    />
  );
}
