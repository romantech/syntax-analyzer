import { useAtom } from 'jotai';
import {
  CONTROL_OPEN_POPUP_DELAY,
  undoRedoActionAtom,
} from '@/features/syntax-editor';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { ImRedo } from 'react-icons/im';
import { clearSelection } from '@/base';

export default function RedoButton() {
  const [actionable, action] = useAtom(undoRedoActionAtom);
  const onClick = () => {
    action('redo');
    clearSelection();
  };

  return (
    <Tooltip label="다시 실행" openDelay={CONTROL_OPEN_POPUP_DELAY}>
      <IconButton
        variant="solid"
        aria-label="Redo the last undone action"
        icon={<ImRedo />}
        isDisabled={!actionable.redo}
        onClick={onClick}
      />
    </Tooltip>
  );
}
