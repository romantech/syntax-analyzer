import { chakra, type HTMLChakraProps, Icon } from '@chakra-ui/react';
import { forwardRef } from 'react';
import { CgClose } from 'react-icons/cg';

import { useColorModeValue } from '@/base/hooks';

const DeleteButtonIcon = forwardRef<HTMLButtonElement, HTMLChakraProps<'button'>>(
  function DeleteButtonIcon(buttonProps, ref) {
    return (
      <chakra.button
        type="button"
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        color={useColorModeValue('gray.300', 'gray.500')}
        _hover={{
          color: useColorModeValue('gray.500', 'gray.400'),
          bg: useColorModeValue('gray.100', 'gray.700'),
        }}
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
