import { useToast } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function useLocationTriggeredToast() {
  const toastOptions = useLocation().state?.toastOptions;

  const toast = useToast();
  const toastId = 'location-triggered-toast';

  useEffect(() => {
    if (!toast.isActive(toastId) && toastOptions) {
      toast({ id: toastId, ...toastOptions });
    }
  }, [toast, toastOptions]);
}
