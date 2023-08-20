import { Outlet, useNavigation } from 'react-router-dom';
import { Loading } from '@/base';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorComponent } from '@/features/misc';

function App() {
  const isLoading = useNavigation().state === 'loading';
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary FallbackComponent={ErrorComponent} onReset={reset}>
      {isLoading ? <Loading /> : <Outlet />}
    </ErrorBoundary>
  );
}

export default App;
