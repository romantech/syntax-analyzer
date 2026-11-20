import { Button, CloseButton, Dialog, Portal } from '@chakra-ui/react';
import { type ReactNode, useRef } from 'react';

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
  const cancelRef = useRef<HTMLButtonElement>(null);
  return (
    <Dialog.Root
      role="alertdialog"
      open={isOpen}
      onOpenChange={({ open }) => {
        if (!open) onClose();
      }}
      initialFocusEl={() => cancelRef.current}
      restoreFocus
      placement="center"
      scrollBehavior="inside"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner px={4}>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title fontSize="lg" fontWeight="bold">
                {headerContent}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" aria-label="닫기" />
            </Dialog.CloseTrigger>
            <Dialog.Body>{bodyContent}</Dialog.Body>
            <Dialog.Footer>
              <Button ref={cancelRef} variant="subtle" onClick={onClose}>
                취소
              </Button>
              <Button colorPalette="teal" onClick={onConfirm}>
                확인
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
