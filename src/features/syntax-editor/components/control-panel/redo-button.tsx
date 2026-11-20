import { IconButton } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { ImRedo } from 'react-icons/im';

import { clearSelection, Tooltip } from '@/base';
import { CONTROL_OPEN_POPUP_DELAY, undoRedoActionAtom } from '@/features/syntax-editor';

export default function RedoButton() {
  const [actionable, action] = useAtom(undoRedoActionAtom);
  const onClick = () => {
    action('redo');
    clearSelection();
  };

  return (
    <Tooltip label="다시 실행" openDelay={CONTROL_OPEN_POPUP_DELAY}>
      <IconButton
        variant="subtle"
        aria-label="Redo the last undone action"
        disabled={!actionable.redo}
        onClick={onClick}
      >
        <ImRedo />
      </IconButton>
    </Tooltip>
  );
}
