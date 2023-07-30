import { SITE_URLS } from '@/constants/siteUrls';

export const TAB_LIST = [
  {
    label: 'home',
    path: '/',
  },
  {
    label: 'syntax analyzer',
    path: SITE_URLS.syntaxAnalyzer,
  },
  {
    label: 'syntax editor',
    path: SITE_URLS.syntaxEditor,
  },
] as const;
