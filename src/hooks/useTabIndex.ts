import { useLocation } from 'react-router-dom';
import { tabList } from '@/constants/tabList.ts';

export default function useTabIndex() {
  const { pathname } = useLocation();
  const current = tabList.findIndex((tab) => tab.path === pathname);
  return current === -1 ? 0 : current;
}
