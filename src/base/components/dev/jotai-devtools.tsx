import { lazy, Suspense } from 'react';

import { DevToolsProps } from 'jotai-devtools';

const LazyDevTools = lazy(() =>
  Promise.all([
    import('jotai-devtools'),
    import('jotai-devtools/styles.css'),
  ]).then(([m]) => ({ default: m.DevTools })),
);

export function JotaiDevTools(props: DevToolsProps) {
  if (!import.meta.env.DEV) return null;
  return (
    <Suspense fallback={null}>
      <LazyDevTools {...props} />
    </Suspense>
  );
}
