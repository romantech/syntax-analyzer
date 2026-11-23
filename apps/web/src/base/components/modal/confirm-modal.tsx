import { Button, CloseButton, Dialog, Portal } from '@chakra-ui/react';
import { type ReactNode, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface ConfirmModalProps {
  onConfirm: () => void;
  headerContent: ReactNode;
  bodyContent: ReactNode;
  confirmLabel: string;
  destructive?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export default function ConfirmModal({
  onConfirm,
  isOpen,
  onClose,
  headerContent,
  bodyContent,
  confirmLabel,
  destructive = false,
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
          <Dialog.Content textStyle="md" borderRadius="md" bg="bg.overlayPanel">
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
              <Button
                ref={cancelRef}
                variant="subtle"
                css={{ '--subtle-button-bg': 'colors.bg.overlayButton' }}
                onClick={onClose}
              >
                {t('common.cancel')}
              </Button>
              <Button
                variant="outline"
                colorPalette={destructive ? 'red' : 'teal'}
                _light={{ color: destructive ? 'red.700' : 'teal.700' }}
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
