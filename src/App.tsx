import MainLayout from '@/components/MainLayout.tsx';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

export default App;
