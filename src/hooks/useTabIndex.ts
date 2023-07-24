import { useLocation } from 'react-router-dom';
import { tabList } from '@/constants/tabList.ts';

export default function useTabIndex() {
  const { pathname } = useLocation();
  return tabList.findIndex((tab) => tab.path === pathname);
}
