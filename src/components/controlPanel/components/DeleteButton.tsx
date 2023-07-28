import { useAtom } from 'jotai';
import { toggleDeleteModeActionAtom } from '@/store/controlPanelStore.ts';
import { IconButton } from '@chakra-ui/react';
import { BsFillEraserFill } from 'react-icons/bs';

const DeleteButton = () => {
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
};

export default DeleteButton;
