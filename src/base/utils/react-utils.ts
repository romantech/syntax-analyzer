import { ComponentType, lazy } from 'react';

/**
 * A utility function that enhances React.lazy() by allowing named imports. This function
 * provides a way to dynamically import individual components using their names.
 *
 * @example
 * const { Home, About } = lazyImport(() => import('@/features/misc'));
 *
 * @see {https://github.com/facebook/react/issues/14603#issuecomment-736878172|React's discussion on named imports}
 * @see {https://github.com/JLarky/react-lazily/blob/main/src/core/lazily.ts|react-lazily source code for a similar approach}
 */
export const lazyImport = <T extends NonNullable<unknown>, U extends keyof T>(
  loader: (x?: string) => Promise<T>,
) => {
  return new Proxy({} as T, {
    get: (_target, componentName: string) => {
      return lazy(() =>
        loader(componentName).then((module) => ({
          default: module[componentName as U] as ComponentType<T>,
        })),
      );
    },
  });
};

export const getDisplayName = <T>(Component: ComponentType<T>) => {
  return Component.displayName || Component.name || 'Component';
};
