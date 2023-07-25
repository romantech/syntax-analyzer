import { useLocation } from 'react-router-dom';
import { TAB_LIST } from '@/constants/tabList.ts';

export default function useTabIndex() {
  const { pathname } = useLocation();
  return TAB_LIST.findIndex((tab) => tab.path === pathname);
}
