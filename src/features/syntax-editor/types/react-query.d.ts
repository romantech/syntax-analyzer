import { QueryKey } from '@tanstack/react-query';

/*
 * UseQueryOptions.meta 속성 타입 지정
 * @see https://github.com/TanStack/query/pull/4253
 * */
interface CustomMeta {
  /** An array of query keys to invalidate upon onSuccess */
  invalidateQueries?: QueryKey;
}

declare module '@tanstack/react-query' {
  interface QueryMeta extends CustomMeta {}
  interface MutationMeta extends CustomMeta {}
}
