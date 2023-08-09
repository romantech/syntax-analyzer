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
import { ReactNode } from 'react';
import { VoidFunc } from '@/base/types/common';

interface DeleteAnalysisButtonProps extends CenterProps {
  onConfirm: VoidFunc;
  popoverHeader?: ReactNode;
}

export default function DeleteIconButton({
  onConfirm,
  popoverHeader = '삭제하시겠습니까?',
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
          transition="all 0.3s"
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
          <PopoverHeader border="0" p={4}>
            {popoverHeader}
          </PopoverHeader>
          <PopoverFooter display="flex" justifyContent="flex-end" border="0">
            <ButtonGroup size="sm">
              <Button onClick={onClose} colorScheme="blue">
                취소
              </Button>
              <Button onClick={() => onConfirm()}>삭제</Button>
            </ButtonGroup>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
