import MainLayout from '@/components/MainLayout.tsx';
import { Outlet, useMatch } from 'react-router-dom';
import { siteUrls } from '@/constants/siteUrls.ts';

function App() {
  const isHome = useMatch(siteUrls.root);
  return (
    <MainLayout>
      {isHome && <div>Home</div>}
      <Outlet />
    </MainLayout>
  );
}

export default App;
