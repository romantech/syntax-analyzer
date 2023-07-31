import { useLocation } from 'react-router-dom';
import { NAV_TABS } from '@/constants/tabList';

export default function useTabIndex() {
  const { pathname } = useLocation();
  return NAV_TABS.findIndex((tab) => tab.path === pathname);
}
