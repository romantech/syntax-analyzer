import { useAtom } from 'jotai';
import { undoRedoActionAtom } from '@/store/segmentHistoryStore';
import { IconButton } from '@chakra-ui/react';
import { ImRedo } from 'react-icons/im';

export default function RedoButton() {
  const [actionable, action] = useAtom(undoRedoActionAtom);
  return (
    <IconButton
      variant="solid"
      aria-label="Redo the last undone action"
      icon={<ImRedo />}
      isDisabled={!actionable.redo}
      onClick={() => action('redo')}
    />
  );
}
