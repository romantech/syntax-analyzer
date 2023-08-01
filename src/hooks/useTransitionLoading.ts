import { startTransition, useEffect, useState } from 'react';

export default function useTransitionLoading(dependencies: unknown[]) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    startTransition(() => setIsLoading(false));
  }, [dependencies]);

  return isLoading;
}
