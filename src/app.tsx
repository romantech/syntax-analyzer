import { Outlet, useNavigation } from 'react-router-dom';
import { Layout, Loading } from '@/base';

function App() {
  const isLoading = useNavigation().state === 'loading';

  return <Layout>{isLoading ? <Loading /> : <Outlet />}</Layout>;
}

export default App;
