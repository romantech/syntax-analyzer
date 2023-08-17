import { Outlet, useNavigation } from 'react-router-dom';
import { Layout, Loading } from '@/base';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorComponent } from '@/features/misc';

function App() {
  const isLoading = useNavigation().state === 'loading';
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary FallbackComponent={ErrorComponent} onReset={reset}>
      <Layout>{isLoading ? <Loading /> : <Outlet />}</Layout>
    </ErrorBoundary>
  );
}

export default App;
