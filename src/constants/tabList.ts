import { SITE_URLS } from '@/constants/siteUrls';
import { AnalysisFromType } from '@/types/analysis';

export const NAV_TABS = [
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

type TabType = { label: string; from: AnalysisFromType };
export const SENTENCE_TABS: TabType[] = [
  { label: '추가한 문장', from: 'user' },
  { label: '샘플 문장', from: 'sample' },
];
