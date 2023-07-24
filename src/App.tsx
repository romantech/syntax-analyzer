import { Outlet, useMatch } from 'react-router-dom';
import { siteUrls } from '@/constants/siteUrls.ts';
import { Intro, Layout } from '@/components';

function App() {
  const isRoot = useMatch(siteUrls.root);
  return (
    <Layout>
      {isRoot && <Intro />}
      <Outlet />
    </Layout>
  );
}

export default App;
