import { chakra, type HTMLChakraProps, Icon } from '@chakra-ui/react';
import { forwardRef } from 'react';
import { CgClose } from 'react-icons/cg';

const DeleteButtonIcon = forwardRef<HTMLButtonElement, HTMLChakraProps<'button'>>(
  function DeleteButtonIcon(buttonProps, ref) {
    return (
      <chakra.button
        type="button"
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        color="fg.muted"
        cursor={{ base: 'pointer', _disabled: 'not-allowed' }}
        _hover={{ color: 'fg', bg: 'bg.subtle' }}
        transition="all 0.3s"
        rounded="full"
        p={1}
        fontSize="xs"
        ref={ref}
        {...buttonProps}
      >
        <Icon as={CgClose} />
      </chakra.button>
    );
  },
);

export default DeleteButtonIcon;
