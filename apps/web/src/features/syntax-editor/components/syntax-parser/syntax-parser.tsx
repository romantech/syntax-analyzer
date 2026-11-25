import { Box, Button } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuChevronsDown, LuChevronsUp } from 'react-icons/lu';
import { TbMoodEmpty } from 'react-icons/tb';

import { TextPlaceholder, ThreeDotsWave, useTransitionLoading } from '@/base';
import {
  deleteModeAtom,
  Sentence,
  selectedTagAtom,
  showFullTagNamesAtom,
  type TAnalysis,
  TokenList,
  type TSegment,
  useCalculateNestingLevel,
  useSyntaxParserAnalysis,
} from '@/features/syntax-editor';
import SegmentList, { hasOverviewTags } from './segment-list';
import '@/features/syntax-editor/styles/constituent.scss';

export default function SyntaxParser({ isTapMode = false }: { isTapMode?: boolean }) {
  const { t } = useTranslation();
  const { analysis, segment } = useSyntaxParserAnalysis();
  const isLoading = useTransitionLoading([analysis, segment]);

  if (isLoading) return <ThreeDotsWave delay={300} />;

  if (!segment || !analysis) {
    return (
      <TextPlaceholder
        fontSize="3xl"
        fontWeight="bold"
        pl={4}
        text={t('editor.noSelectedSentence')}
        endIcon={TbMoodEmpty}
      />
    );
  }

  return (
    <AnalysisSentence
      key={analysis.id}
      analysis={analysis}
      segment={segment}
      isTapMode={isTapMode}
    />
  );
}

function AnalysisSentence({
  analysis,
  segment,
  isTapMode,
}: {
  analysis: TAnalysis;
  segment: TSegment;
  isTapMode: boolean;
}) {
  const { t, i18n } = useTranslation();
  const sentenceRef = useRef<HTMLParagraphElement>(null);
  const sentenceId = useId();
  const showFullTagNames = useAtomValue(showFullTagNamesAtom);
  const [showAllTags, setShowAllTags] = useState(false);
  const [{ expanded, entering }, setDetails] = useState<{
    expanded: ReadonlySet<number>;
    entering: number | null;
  }>(() => ({ expanded: new Set(), entering: null }));
  const selectedTag = useAtomValue(selectedTagAtom);
  const deleteMode = useAtomValue(deleteModeAtom);
  const isEditing = !!selectedTag || deleteMode;
  const hasOverview = analysis.isAnalyzedByGPT && hasOverviewTags(segment);
  const allTagsVisible = !hasOverview || showAllTags || isEditing;

  const toggle = (segmentId: number, animate: boolean) =>
    setDetails((previous) => {
      const next = new Set(previous.expanded);
      const opening = !next.has(segmentId);
      if (!opening) next.delete(segmentId);
      else next.add(segmentId);
      return { expanded: next, entering: opening && animate ? segmentId : null };
    });

  useEffect(() => {
    if (entering === null) return;
    // Clear the entrance state once the label animation has finished.
    const timeout = window.setTimeout(() => {
      setDetails((previous) =>
        previous.entering === entering ? { ...previous, entering: null } : previous,
      );
    }, 200);
    return () => window.clearTimeout(timeout);
  }, [entering]);

  useCalculateNestingLevel({
    targetRef: sentenceRef,
    segment,
    isTapMode,
    overviewDetails: allTagsVisible ? undefined : expanded,
    showFullTagNames,
    language: i18n.resolvedLanguage,
  });

  return (
    <>
      {hasOverview && (
        <Box position="sticky" insetInlineStart={0} w="fit-content" mb={2} zIndex={3}>
          <Button
            size="sm"
            minH={isTapMode ? 11 : 9}
            variant="outline"
            colorPalette="teal"
            bg={{ base: 'teal.50', _dark: '#101e1c' }}
            color={{ base: 'teal.700', _dark: '#80ecd9' }}
            borderColor={{ base: 'teal.600', _dark: '#52bbad' }}
            _expanded={{
              bg: { base: 'teal.100', _dark: 'teal.800' },
              color: { _dark: 'teal.200' },
            }}
            aria-expanded={allTagsVisible}
            aria-controls={sentenceId}
            disabled={isEditing}
            onClick={() => {
              if (showAllTags) setDetails({ expanded: new Set(), entering: null });
              setShowAllTags(!showAllTags);
            }}
          >
            {allTagsVisible ? <LuChevronsUp aria-hidden /> : <LuChevronsDown aria-hidden />}
            {allTagsVisible ? t('editor.collapseAllTags') : t('editor.expandAllTags')}
          </Button>
        </Box>
      )}
      <Sentence ref={sentenceRef} id={sentenceId} isTapMode={isTapMode}>
        <SegmentList
          segment={segment}
          tokenElements={TokenList({ sentence: analysis.sentence, isTapMode })}
          overview={allTagsVisible ? undefined : { expanded, entering, toggle }}
        />
      </Sentence>
    </>
  );
}
