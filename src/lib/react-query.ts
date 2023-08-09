import { DefaultOptions, QueryClient } from '@tanstack/react-query';

const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 30, // 30 seconds
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });
