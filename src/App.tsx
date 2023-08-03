import { Outlet, useNavigation } from 'react-router-dom';
import { Layout } from '@/layout';
import { Loading } from '@/components';

function App() {
  const isLoading = useNavigation().state === 'loading';
  return <Layout>{isLoading ? <Loading /> : <Outlet />}</Layout>;
}

export default App;
