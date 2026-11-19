import { CloseButton, createToaster, Portal, Toast, Toaster } from '@chakra-ui/react';

type ToastOptions = {
  title: string;
  status: 'success' | 'error';
  duration?: number;
};

const toaster = createToaster({
  placement: 'bottom',
  offsets: {
    top: '1rem',
    left: '1rem',
    right: '1rem',
    bottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))',
  },
});

export function showToast({ title, status, duration = 3000 }: ToastOptions): void {
  toaster.create({ title, type: status, duration, closable: true });
}

export function AppToaster() {
  return (
    <Portal>
      <Toaster toaster={toaster}>
        {(toast) => (
          <Toast.Root>
            <Toast.Indicator />
            <Toast.Title>{toast.title}</Toast.Title>
            <Toast.CloseTrigger asChild>
              <CloseButton size="xs" />
            </Toast.CloseTrigger>
          </Toast.Root>
        )}
      </Toaster>
    </Portal>
  );
}
