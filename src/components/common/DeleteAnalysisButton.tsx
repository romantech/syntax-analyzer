import {
  Button,
  ButtonGroup,
  Center,
  CenterProps,
  Icon,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { CgClose } from 'react-icons/cg';
import React from 'react';
import { VoidFunc } from '@/types/common';

interface DeleteAnalysisButtonProps extends CenterProps {
  onConfirm: VoidFunc;
}

export default function DeleteAnalysisButton({
  onConfirm,
  ...buttonProps
}: DeleteAnalysisButtonProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <Popover isOpen={isOpen} onClose={onClose}>
      <PopoverTrigger>
        <Center
          color={useColorModeValue('gray.300', 'gray.500')}
          _hover={{
            color: useColorModeValue('gray.500', 'gray.400'),
            bg: useColorModeValue('gray.100', 'gray.700'),
          }}
          as="button"
          rounded="full"
          p={1}
          fontSize="xs"
          onClick={onOpen}
          {...buttonProps}
        >
          <Icon as={CgClose} />
        </Center>
      </PopoverTrigger>
      <Portal>
        <PopoverContent w="fit-content">
          <PopoverArrow />
          <PopoverHeader border="0" py={4}>
            선택한 문장을 삭제하시겠습니까?
          </PopoverHeader>
          <PopoverFooter display="flex" justifyContent="flex-end">
            <ButtonGroup size="sm" variant="outline">
              <Button onClick={onClose}>취소</Button>
              <Button onClick={() => onConfirm()}>삭제</Button>
            </ButtonGroup>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
