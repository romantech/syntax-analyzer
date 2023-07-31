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
    path: SITE_URLS.syntaxAnalyzer.root,
    matchPath: `${SITE_URLS.syntaxAnalyzer.root}/*`,
  },
  {
    label: 'syntax editor',
    path: SITE_URLS.syntaxEditor.root,
    matchPath: `${SITE_URLS.syntaxEditor.root}/*`,
  },
] as const;

type TabType = { label: string; from: AnalysisFromType };
export const SENTENCE_TABS: TabType[] = [
  { label: '추가한 문장', from: 'user' },
  { label: '샘플 문장', from: 'sample' },
];
