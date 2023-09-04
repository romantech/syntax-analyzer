import { IconButton, Tooltip } from '@chakra-ui/react';
import { useAtom, useAtomValue } from 'jotai';
import { BsFillEraserFill } from 'react-icons/bs';

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
        variant="solid"
        colorScheme={isDeleteMode ? 'teal' : 'gray'}
        aria-label="Delete Tag"
        icon={<BsFillEraserFill />}
        onClick={toggleDeleteMode}
        isDisabled={isDisableDeleteButton}
      />
    </Tooltip>
  );
}
