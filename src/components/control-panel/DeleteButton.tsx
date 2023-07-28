import { useAtom } from 'jotai';
import { toggleDeleteModeActionAtom } from '@/store/controlPanelStore';
import { IconButton } from '@chakra-ui/react';
import { BsFillEraserFill } from 'react-icons/bs';

export default function DeleteButton() {
  const [isDeleteMode, toggleDeleteMode] = useAtom(toggleDeleteModeActionAtom);
  return (
    <IconButton
      variant="solid"
      colorScheme={isDeleteMode ? 'blue' : 'gray'}
      aria-label="Delete Tag"
      icon={<BsFillEraserFill />}
      onClick={toggleDeleteMode}
    />
  );
}
