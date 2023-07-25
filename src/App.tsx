import { Outlet } from 'react-router-dom';
import { Layout } from '@/layout';

function App() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default App;
