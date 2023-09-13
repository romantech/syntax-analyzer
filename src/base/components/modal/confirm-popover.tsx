import { MouseEventHandler, ReactNode } from 'react';

import {
  Box,
  Button,
  ButtonGroup,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverProps,
  PopoverTrigger,
  Portal,
  useDisclosure,
} from '@chakra-ui/react';

import { VoidFunc } from '@/base';

type ChildrenProps = { onOpen: MouseEventHandler; isOpen: boolean };
interface ConfirmPopoverProps extends Omit<PopoverProps, 'children'> {
  onConfirm: VoidFunc;
  headerText?: ReactNode;
  cancelText?: string;
  confirmText?: string;
  children: ({ onOpen }: ChildrenProps) => ReactNode;
}

export default function ConfirmPopover({
  onConfirm,
  children,
  headerText,
  cancelText = '취소',
  confirmText = '확인',
  ...popoverProps
}: ConfirmPopoverProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const onConfirmButtonClick = () => {
    onConfirm();
    onClose();
  };

  return (
    <Popover isOpen={isOpen} onClose={onClose} {...popoverProps}>
      <PopoverTrigger>
        <Box as="button">{children({ onOpen, isOpen })}</Box>
      </PopoverTrigger>
      <Portal>
        <PopoverContent w="fit-content" minW={220}>
          <PopoverArrow />
          <PopoverHeader border="0" p={4}>
            {headerText}
          </PopoverHeader>
          <PopoverFooter display="flex" justifyContent="flex-end" border="0">
            <ButtonGroup size="sm">
              <Button onClick={onClose}>{cancelText}</Button>
              <Button colorScheme="teal" onClick={onConfirmButtonClick}>
                {confirmText}
              </Button>
            </ButtonGroup>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
