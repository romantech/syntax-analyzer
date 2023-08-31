import {
  CONTROL_OPEN_POPUP_DELAY,
  undoRedoActionAtom,
} from '@/features/syntax-editor';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { ImUndo } from 'react-icons/im';
import { useAtom } from 'jotai';
import { clearSelection } from '@/base';

export default function UndoButton() {
  const [actionable, action] = useAtom(undoRedoActionAtom);
  const onClick = () => {
    action('undo');
    clearSelection();
  };

  return (
    <Tooltip label="실행 취소" openDelay={CONTROL_OPEN_POPUP_DELAY}>
      <IconButton
        variant="solid"
        aria-label="Undo the last action"
        icon={<ImUndo />}
        isDisabled={!actionable.undo}
        onClick={onClick}
      />
    </Tooltip>
  );
}
