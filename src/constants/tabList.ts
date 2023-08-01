import { SITE_URLS } from '@/constants/siteUrls';
import { AnalysisSourceType } from '@/types/analysis';

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

type SentenceTab = { label: string; source: AnalysisSourceType };
export const SENTENCE_TABS: SentenceTab[] = [
  { label: '추가한 문장', source: 'user' },
  { label: '샘플 문장', source: 'sample' },
];
