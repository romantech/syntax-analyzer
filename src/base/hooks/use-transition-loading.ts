import { startTransition, useEffect, useState } from 'react';

export const useTransitionLoading = (dependencies: unknown[]) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    startTransition(() => setIsLoading(false));
  }, [dependencies]);

  return isLoading;
};
