import { undoRedoActionAtom } from '@/store/segmentHistoryStore';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { ImUndo } from 'react-icons/im';
import { useAtom } from 'jotai';

export default function UndoButton() {
  const [actionable, action] = useAtom(undoRedoActionAtom);
  return (
    <Tooltip label="실행 취소" openDelay={200}>
      <IconButton
        variant="solid"
        aria-label="Undo the last action"
        icon={<ImUndo />}
        isDisabled={!actionable.undo}
        onClick={() => action('undo')}
      />
    </Tooltip>
  );
}
