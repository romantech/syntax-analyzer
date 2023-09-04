import { Suspense } from 'react';

import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { LazyMotion } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet } from 'react-router-dom';

import { Layout, ThreeDotsWave, useRemoveBodyBgColor } from '@/base';
import { ErrorComponent } from '@/features/misc';

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
  useRemoveBodyBgColor();

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
