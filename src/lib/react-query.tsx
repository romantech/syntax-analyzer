import {
  DefaultOptions,
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

const defaultOptions: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 30, // 30 seconds
    retry: 2,
  },
};

export const ConfiguredQueryProvider = ({ children }: PropsWithChildren) => {
  const toast = useToast();

  const showErrorToast = () => {
    toast({
      title: '에러가 발생했어요, 잠시 후 다시 시도해주세요',
      status: 'error',
    });
  };

  const queryClient = new QueryClient({
    defaultOptions,
    mutationCache: new MutationCache({ onError: showErrorToast }),
    queryCache: new QueryCache({
      onError: (error, query) => {
        /**
         * 백그라운드 업데이트 실패시에만 Toast 표시, 나머진 ErrorBoundary 에서 처리
         * @see https://tkdodo.eu/blog/react-query-error-handling
         * */
        if (query.state.data !== undefined) showErrorToast();
      },
      onSuccess: (_, query) => {
        const invalidateQueries = query.meta?.invalidateQueries;
        if (invalidateQueries) queryClient.invalidateQueries(invalidateQueries);
      },
    }),
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
