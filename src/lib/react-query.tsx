import { PropsWithChildren } from 'react';

import { useToast } from '@chakra-ui/react';
import {
  DefaultOptions,
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
  QueryKey,
} from '@tanstack/react-query';

/**
 * UseQueryOptions.meta 속성 타입 지정 (queryFn의 meta 파라미터 타입)
 * {@link https://tanstack.com/query/latest/docs/framework/react/typescript#typing-meta 공식 문서}
 * */
interface CustomMeta extends Record<string, unknown> {
  invalidateQueries?: QueryKey;
}

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: CustomMeta;
    mutationMeta: CustomMeta;
  }
}

const defaultOptions: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 30, // 30 seconds
    retry: 1,
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
    mutationCache: new MutationCache({
      onError: showErrorToast,
      onSuccess: (_data, _variables, _context, mutation) => {
        const { invalidateQueries = [] } = mutation.meta ?? {};
        if (invalidateQueries.length === 0) return;
        queryClient.invalidateQueries({ queryKey: invalidateQueries });
      },
    }),
    queryCache: new QueryCache({
      onError: (error, query) => {
        /**
         * 백그라운드 업데이트 실패시에만 Toast 표시, 나머진 ErrorBoundary 에서 처리
         * @see https://tkdodo.eu/blog/react-query-error-handling
         * */
        if (query.state.data !== undefined) showErrorToast();
      },
      onSuccess: (_data, query) => {
        const { invalidateQueries = [] } = query.meta ?? {};
        if (invalidateQueries.length === 0) return;
        queryClient.invalidateQueries({ queryKey: invalidateQueries });
      },
    }),
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
