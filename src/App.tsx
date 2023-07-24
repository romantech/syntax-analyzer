import Layout from '@/components/Layout.tsx';
import { Outlet, useMatch } from 'react-router-dom';
import { siteUrls } from '@/constants/siteUrls.ts';
import Intro from '@/components/Intro.tsx';

function App() {
  const isHome = useMatch(siteUrls.root);
  return (
    <Layout>
      {isHome && <Intro />}
      <Outlet />
    </Layout>
  );
}

export default App;
