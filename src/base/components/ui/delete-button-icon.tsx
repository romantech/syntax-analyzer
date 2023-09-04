import { forwardRef } from 'react';

import { ButtonProps, Center, Icon, useColorModeValue } from '@chakra-ui/react';
import { CgClose } from 'react-icons/cg';

const DeleteButtonIcon = forwardRef<HTMLButtonElement, ButtonProps>(
  function DeleteButtonIcon(buttonProps, ref) {
    return (
      <Center
        color={useColorModeValue('gray.300', 'gray.500')}
        _hover={{
          color: useColorModeValue('gray.500', 'gray.400'),
          bg: useColorModeValue('gray.100', 'gray.700'),
        }}
        transition="all 0.3s"
        as="button"
        rounded="full"
        p={1}
        fontSize="xs"
        ref={ref}
        {...buttonProps}
      >
        <Icon as={CgClose} />
      </Center>
    );
  },
);

export default DeleteButtonIcon;
