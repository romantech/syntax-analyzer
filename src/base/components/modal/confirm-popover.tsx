import {
  Box,
  Button,
  ButtonGroup,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  useDisclosure,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';

import type { VoidFunc } from '@/base';

type ChildrenProps = { onOpen: () => void; isOpen: boolean };
interface ConfirmPopoverProps {
  onConfirm: VoidFunc;
  headerText: string;
  children: (props: ChildrenProps) => ReactNode;
}

export default function ConfirmPopover({ onConfirm, children, headerText }: ConfirmPopoverProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const onConfirmButtonClick = () => {
    onConfirm();
    onClose();
  };

  return (
    <Popover isOpen={isOpen} onClose={onClose}>
      <PopoverTrigger>
        <Box role="button">{children({ onOpen, isOpen })}</Box>
      </PopoverTrigger>
      <Portal>
        <PopoverContent w="fit-content" minW={220}>
          <PopoverArrow />
          <PopoverHeader border="0" p={4}>
            {headerText}
          </PopoverHeader>
          <PopoverFooter display="flex" justifyContent="flex-end" border="0">
            <ButtonGroup size="sm">
              <Button onClick={onClose}>취소</Button>
              <Button colorScheme="teal" onClick={onConfirmButtonClick}>
                확인
              </Button>
            </ButtonGroup>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
