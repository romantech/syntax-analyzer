import { Button, CloseButton, Dialog, Portal } from '@chakra-ui/react';
import { type ReactNode, useRef } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
      size="sm"
    >
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.600" />
        <Dialog.Positioner px={4}>
          <Dialog.Content textStyle="md" borderRadius="md">
            <Dialog.Header pt={4}>
              <Dialog.Title fontSize="lg" lineHeight="base" fontWeight="bold">
                {headerContent}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger asChild>
              <CloseButton
                size="sm"
                insetEnd={3}
                aria-label={t('common.close')}
                _icon={{ boxSize: 5 }}
              />
            </Dialog.CloseTrigger>
            <Dialog.Body pb={2} wordBreak="keep-all">
              {bodyContent}
            </Dialog.Body>
            <Dialog.Footer pt={4}>
              <Button ref={cancelRef} variant="subtle" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button
                variant="outline"
                colorPalette="teal"
                _light={{ color: 'teal.700' }}
                onClick={onConfirm}
              >
                {t('common.confirm')}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
