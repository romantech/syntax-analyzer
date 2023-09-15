import { ComponentType, lazy } from 'react';

type ComponentName = string;
type Loader<T> = () => Promise<T>;
type NamedComponents = Record<ComponentName, unknown>;

/**
 * A utility function that enhances React.lazy() by allowing named imports. This function
 * provides a way to dynamically import individual components using their names.
 *
 * @example
 * const { Home, About } = lazyImport(() => import('@/features/misc'));
 *
 * @see {https://github.com/facebook/react/issues/14603#issuecomment-736878172 React's discussion on named imports}
 * @see {https://github.com/JLarky/react-lazily/blob/main/src/core/lazily.ts react-lazily source code for a similar approach}
 */
export const lazyImport = <T extends NamedComponents>(loader: Loader<T>) => {
  return new Proxy({} as T, {
    get: (_target, name: ComponentName) => {
      return lazy(async () => {
        const module = await loader();
        const Component = module[name] as ComponentType<T>;
        if (!Component) throw new Error(`Component ${name} not found`);

        return { default: Component };
      });
    },
  });
};

export const getDisplayName = <T>(Component: ComponentType<T>) => {
  return Component.displayName || Component.name || 'Component';
};
