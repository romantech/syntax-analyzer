import { Box, Button } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TbMoodEmpty } from 'react-icons/tb';

import { TextPlaceholder, ThreeDotsWave, useTransitionLoading } from '@/base';
import {
  deleteModeAtom,
  Sentence,
  selectedTagAtom,
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
  const { t } = useTranslation();
  const sentenceRef = useRef<HTMLParagraphElement>(null);
  const [showAllTags, setShowAllTags] = useState(false);
  const [expanded, setExpanded] = useState<ReadonlySet<number>>(() => new Set());
  const selectedTag = useAtomValue(selectedTagAtom);
  const deleteMode = useAtomValue(deleteModeAtom);
  const isEditing = !!selectedTag || deleteMode;
  const hasOverview = analysis.isAnalyzedByGPT && hasOverviewTags(segment);
  const allTagsVisible = !hasOverview || showAllTags || isEditing;

  const toggle = (segmentId: number) =>
    setExpanded((previous) => {
      const next = new Set(previous);
      if (next.has(segmentId)) next.delete(segmentId);
      else next.add(segmentId);
      return next;
    });

  useCalculateNestingLevel({
    targetRef: sentenceRef,
    segment,
    isTapMode,
    overviewDetails: allTagsVisible ? undefined : expanded,
  });

  return (
    <>
      {hasOverview && (
        <Box position="sticky" insetInlineStart={0} w="fit-content" mb={2} zIndex={3}>
          <Button
            size="sm"
            minH={isTapMode ? '44px' : undefined}
            variant={allTagsVisible ? 'subtle' : 'outline'}
            colorPalette={allTagsVisible ? 'teal' : 'gray'}
            aria-pressed={allTagsVisible}
            disabled={isEditing}
            onClick={() => setShowAllTags((previous) => !previous)}
          >
            {t('editor.allTags')}
          </Button>
        </Box>
      )}
      <Sentence ref={sentenceRef} isTapMode={isTapMode}>
        <SegmentList
          segment={segment}
          tokenElements={TokenList({ sentence: analysis.sentence, isTapMode })}
          overview={allTagsVisible ? undefined : { expanded, toggle }}
        />
      </Sentence>
    </>
  );
}
