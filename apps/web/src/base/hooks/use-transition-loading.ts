import { startTransition, useEffect, useState } from 'react';

export const useTransitionLoading = (dependencies: unknown[]) => {
  const [isLoading, setIsLoading] = useState(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies: this hook intentionally forwards a caller-provided dependency list.
  useEffect(() => {
    startTransition(() => setIsLoading(false));
  }, [dependencies]);

  return isLoading;
};
