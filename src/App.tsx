import { Outlet, useMatch } from 'react-router-dom';
import { Intro, Layout } from '@/components';
import { SITE_URLS } from '@/constants/siteUrls.ts';

function App() {
  const isRoot = useMatch(SITE_URLS.root);
  return (
    <Layout>
      {isRoot && <Intro />}
      <Outlet />
    </Layout>
  );
}

export default App;
