import { CloseButton, createToaster, Icon, Portal, Toast, Toaster } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BsCheckCircleFill, BsExclamationCircleFill } from 'react-icons/bs';

type ToastOptions = {
  title: string;
  status: 'success' | 'error';
  duration?: number;
};

const toaster = createToaster({
  placement: 'bottom',
  offsets: {
    top: '1rem',
    left: '0.5rem',
    right: '0.5rem',
    bottom: 'calc(1.75rem + env(safe-area-inset-bottom, 0px))',
  },
});

export function showToast({ title, status, duration = 3000 }: ToastOptions): void {
  toaster.create({ title, type: status, duration, closable: true });
}

export function AppToaster() {
  const { t } = useTranslation();
  return (
    <Portal>
      <Toaster toaster={toaster} label={t('common.notifications')}>
        {(toast) => (
          <Toast.Root
            w="fit-content"
            minW="min(300px, 100%)"
            maxW="min(560px, 100%)"
            alignItems="start"
            py={3}
            pe={8}
            borderRadius="md"
            boxShadow="lg"
            css={{
              '&[data-type=success]': {
                bg: 'green.600',
                _dark: { bg: 'green.200', color: 'gray.900' },
              },
              '&[data-type=error]': {
                bg: 'red.600',
                _dark: { bg: 'red.200', color: 'gray.900' },
              },
            }}
          >
            <Icon
              as={toast.type === 'success' ? BsCheckCircleFill : BsExclamationCircleFill}
              w={5}
              h={6}
              flexShrink={0}
              aria-hidden
            />
            <Toast.Title fontSize="md" lineHeight="base" fontWeight="bold" minW={0}>
              {toast.title}
            </Toast.Title>
            <Toast.CloseTrigger asChild>
              <CloseButton
                aria-label={t('common.close')}
                size="xs"
                color="inherit"
                _icon={{ boxSize: 4 }}
              />
            </Toast.CloseTrigger>
          </Toast.Root>
        )}
      </Toaster>
    </Portal>
  );
}
