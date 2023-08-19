import { ComponentType, lazy } from 'react';

// named imports for React.lazy: https://github.com/facebook/react/issues/14603#issuecomment-726551598
// Usage: const { Home } = lazyImport(() => import("./Home"), "Home");
// @ts-expected-error TS complains about the return type of lazyImport, but it's correct
export function lazyImport<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends ComponentType<any>,
  I extends { [K2 in K]: T },
  K extends keyof I,
>(factory: () => Promise<I>, name: K): I {
  return Object.create({
    [name]: lazy(() => factory().then((module) => ({ default: module[name] }))),
  });
}

export const getDisplayName = <T>(Component: ComponentType<T>) => {
  return Component.displayName || Component.name || 'Component';
};
