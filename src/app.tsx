import { Outlet } from 'react-router-dom';
import { Layout, ThreeDotsWave } from '@/base';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorComponent } from '@/features/misc';
import { Suspense } from 'react';

const Fallback = () => (
  <Layout h="calc(100vh - 72px)" centerContent justifyContent="center">
    <ThreeDotsWave />
  </Layout>
);

export const App = () => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary FallbackComponent={ErrorComponent} onReset={reset}>
      <Suspense fallback={<Fallback />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  );
};
