import { Outlet } from 'react-router-dom';
import { Layout, ThreeDotsWave } from '@/base';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorComponent } from '@/features/misc';
import { Suspense } from 'react';
import { LazyMotion } from 'framer-motion';

/**
 * Reduce bundle size by only importing the domAnimation feature
 * @see https://www.framer.com/motion/guide-reduce-bundle-size/
 * */
const framerFeature = async () => (await import('@/base')).domAnimation;

const Fallback = () => (
  <Layout h="calc(100vh - 72px)" centerContent justifyContent="center">
    <ThreeDotsWave />
  </Layout>
);

export const App = () => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <LazyMotion features={framerFeature}>
      <ErrorBoundary FallbackComponent={ErrorComponent} onReset={reset}>
        <Suspense fallback={<Fallback />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </LazyMotion>
  );
};
