import { Outlet, useNavigation } from 'react-router-dom';
import { Layout } from '@/layout';
import { Loading } from '@/components';

function App() {
  const navigation = useNavigation();
  return (
    <Layout>
      {navigation.state === 'loading' && <Loading />}
      <Outlet />
    </Layout>
  );
}

export default App;
