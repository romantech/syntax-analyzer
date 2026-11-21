import { IconButton } from '@chakra-ui/react';
import { useAtom, useAtomValue } from 'jotai';
import { BsFillEraserFill } from 'react-icons/bs';

import { Tooltip } from '@/base';
import {
  CONTROL_OPEN_POPUP_DELAY,
  isDisableDeleteButtonAtom,
  toggleDeleteModeActionAtom,
} from '@/features/syntax-editor';

export default function DeleteButton() {
  const [isDeleteMode, toggleDeleteMode] = useAtom(toggleDeleteModeActionAtom);
  const isDisableDeleteButton = useAtomValue(isDisableDeleteButtonAtom);

  return (
    <Tooltip label="태그 삭제" openDelay={CONTROL_OPEN_POPUP_DELAY}>
      <IconButton
        variant={isDeleteMode ? 'outline' : 'subtle'}
        colorPalette={isDeleteMode ? 'teal' : 'gray'}
        aria-label="Delete Tag"
        aria-pressed={isDeleteMode}
        onClick={toggleDeleteMode}
        disabled={isDisableDeleteButton}
      >
        <BsFillEraserFill />
      </IconButton>
    </Tooltip>
  );
}
