import { SITE_URLS } from '@/constants/siteUrls';
import { AnalysisFromType } from '@/types/analysis';

export const NAV_TABS = [
  {
    label: 'home',
    path: '/',
    matchPath: '/',
  },
  {
    label: 'syntax analyzer',
    path: SITE_URLS.SYNTAX_ANALYZER.ROOT,
    matchPath: `${SITE_URLS.SYNTAX_ANALYZER.ROOT}/*`,
  },
  {
    label: 'syntax editor',
    path: SITE_URLS.SYNTAX_EDITOR.ROOT,
    matchPath: `${SITE_URLS.SYNTAX_EDITOR.ROOT}/*`,
  },
] as const;

type TabType = { label: string; from: AnalysisFromType };
export const SENTENCE_TABS: TabType[] = [
  { label: '추가한 문장', from: 'user' },
  { label: '샘플 문장', from: 'sample' },
];
