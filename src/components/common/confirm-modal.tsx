import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { ReactNode, useRef } from 'react';

interface ConfirmModalProps {
  onConfirm: () => void;
  headerContent: ReactNode;
  bodyContent: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export default function ConfirmModal({
  onConfirm,
  isOpen,
  onClose,
  headerContent,
  bodyContent,
}: ConfirmModalProps) {
  const cancelRef = useRef(null);
  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={cancelRef}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {headerContent}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>{bodyContent}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              취소
            </Button>
            <Button colorScheme="blue" onClick={onConfirm} ml={3}>
              확인
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
