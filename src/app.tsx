import { Outlet, useNavigation } from 'react-router-dom';
import { Layout, Loading, useLocationTriggeredToast } from '@/base';

function App() {
  useLocationTriggeredToast();
  const isLoading = useNavigation().state === 'loading';

  return <Layout>{isLoading ? <Loading /> : <Outlet />}</Layout>;
}

export default App;
