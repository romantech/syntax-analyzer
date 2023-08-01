import { useAtom } from 'jotai';
import { undoRedoActionAtom } from '@/store/segmentHistoryStore';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { ImRedo } from 'react-icons/im';

export default function RedoButton() {
  const [actionable, action] = useAtom(undoRedoActionAtom);
  return (
    <Tooltip label="다시 실행" openDelay={200}>
      <IconButton
        variant="solid"
        aria-label="Redo the last undone action"
        icon={<ImRedo />}
        isDisabled={!actionable.redo}
        onClick={() => action('redo')}
      />
    </Tooltip>
  );
}
