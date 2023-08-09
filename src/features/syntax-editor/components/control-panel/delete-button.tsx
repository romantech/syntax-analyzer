import { useAtom, useAtomValue } from 'jotai';
import {
  isDisableDeleteButtonAtom,
  toggleDeleteModeActionAtom,
} from '@/features/syntax-editor';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { BsFillEraserFill } from 'react-icons/bs';

export default function DeleteButton() {
  const [isDeleteMode, toggleDeleteMode] = useAtom(toggleDeleteModeActionAtom);
  const isDisableDeleteButton = useAtomValue(isDisableDeleteButtonAtom);

  return (
    <Tooltip label="태그 삭제" openDelay={200}>
      <IconButton
        variant="solid"
        colorScheme={isDeleteMode ? 'blue' : 'gray'}
        aria-label="Delete Tag"
        icon={<BsFillEraserFill />}
        onClick={toggleDeleteMode}
        isDisabled={isDisableDeleteButton}
      />
    </Tooltip>
  );
}
