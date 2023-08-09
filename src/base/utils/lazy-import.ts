import { ComponentType, lazy } from 'react';

// named imports for React.lazy: https://github.com/facebook/react/issues/14603#issuecomment-726551598
// @ts-expected-error TS complains about the return type of lazyImport, but it's correct
export function lazyImport<
  T extends ComponentType<any>,
  I extends { [K2 in K]: T },
  K extends keyof I,
>(factory: () => Promise<I>, name: K): I {
  return Object.create({
    [name]: lazy(() => factory().then((module) => ({ default: module[name] }))),
  });
}

// Usage
// const { Home } = lazyImport(() => import("./Home"), "Home");
