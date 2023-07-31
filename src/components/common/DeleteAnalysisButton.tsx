import {
  Box,
  BoxProps,
  Button,
  ButtonGroup,
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

interface DeleteAnalysisButtonProps extends BoxProps {
  onConfirm: VoidFunc;
}

export default function DeleteAnalysisButton({
  onConfirm,
  ...boxProps
}: DeleteAnalysisButtonProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const iconHoverColor = useColorModeValue('gray.800', 'gray.200');
  return (
    <Popover isOpen={isOpen} onClose={onClose}>
      <PopoverTrigger>
        <Box
          fontSize="sm"
          rounded="full"
          color="gray.400"
          _hover={{ color: iconHoverColor }}
          p={1}
          as="button"
          onClick={onOpen}
          {...boxProps}
        >
          <Icon as={CgClose} />
        </Box>
      </PopoverTrigger>
      <Portal>
        <PopoverContent w="fit-content">
          <PopoverArrow />
          <PopoverHeader border="0" py={4}>
            선택한 문장을 삭제하시겠습니까?
          </PopoverHeader>
          <PopoverFooter display="flex" justifyContent="flex-end">
            <ButtonGroup size="sm">
              <Button onClick={onClose}>취소</Button>
              <Button onClick={() => onConfirm()}>확인</Button>
            </ButtonGroup>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
