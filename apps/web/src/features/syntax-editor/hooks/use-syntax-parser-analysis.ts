import { useAtomValue } from 'jotai';

import { currentSegmentFromHistoryAtom, selectedAnalysisAtom } from '@/features/syntax-editor';

export const useSyntaxParserAnalysis = () => {
  const analysis = useAtomValue(selectedAnalysisAtom);
  const segment = useAtomValue(currentSegmentFromHistoryAtom);
  return { analysis, segment };
};
