import { Box } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TbMoodEmpty } from 'react-icons/tb';

import { TextPlaceholder, ThreeDotsWave, useTransitionLoading } from '@/base';
import {
  CONSTITUENT_DATA_ATTRS,
  deleteModeAtom,
  Sentence,
  selectedTagAtom,
  showFullTagNamesAtom,
  type TAnalysis,
  TokenList,
  type TSegment,
  tagInfoModeAtom,
  useCalculateNestingLevel,
  useSyntaxParserAnalysis,
} from '@/features/syntax-editor';
import { getLearningSegment } from '@/features/syntax-editor/helpers/learning-tags';
import {
  areAllOverviewTagsVisible,
  getOverviewDetails,
  toggleOverviewExpansion,
} from '@/features/syntax-editor/helpers/overview-details';
import AllTagsButton from './all-tags-button';
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
  const { i18n } = useTranslation();
  const sentenceRef = useRef<HTMLParagraphElement>(null);
  const sentenceId = useId();
  const showFullTagNames = useAtomValue(showFullTagNamesAtom);
  const [showAllTags, setShowAllTags] = useState(false);
  const [toggled, setToggled] = useState<ReadonlySet<number>>(() => new Set());
  const [previouslyVisibleTags, setPreviouslyVisibleTags] = useState<ReadonlySet<number>>();
  const selectedTag = useAtomValue(selectedTagAtom);
  const deleteMode = useAtomValue(deleteModeAtom);
  const isEditing = !!selectedTag || deleteMode;
  const showTagDescriptions = useAtomValue(tagInfoModeAtom) && !isEditing;
  const learningSegment = useMemo(
    () => (analysis.isAnalyzedByGPT ? getLearningSegment(segment, analysis.sentence) : segment),
    [analysis.isAnalyzedByGPT, analysis.sentence, segment],
  );
  const hasOverview = analysis.isAnalyzedByGPT && hasOverviewTags(learningSegment);
  const displayedSegment = isEditing ? segment : learningSegment;
  const overviewDetails = useMemo(
    () =>
      hasOverview && !isEditing
        ? getOverviewDetails(learningSegment, toggled, showAllTags)
        : undefined,
    [hasOverview, isEditing, learningSegment, toggled, showAllTags],
  );
  const allTagsVisible =
    isEditing ||
    (!!overviewDetails &&
      (showAllTags || toggled.size > 0) &&
      areAllOverviewTagsVisible(learningSegment, overviewDetails));
  const overviewBaseline = useMemo(
    () => (hasOverview && !isEditing ? getOverviewDetails(learningSegment, new Set()) : undefined),
    [hasOverview, isEditing, learningSegment],
  );

  const markRevealedTags = (animate: boolean) => {
    if (!animate || !sentenceRef.current) {
      setPreviouslyVisibleTags(undefined);
      return;
    }

    const labels = sentenceRef.current.querySelectorAll('.constituent-label');
    setPreviouslyVisibleTags(
      new Set(Array.from(labels, (label) => Number(label.getAttribute(CONSTITUENT_DATA_ATTRS.ID)))),
    );
  };

  const toggle = (segmentId: number, animate: boolean) => {
    markRevealedTags(animate && !overviewDetails?.get(segmentId)?.expanded);
    setToggled((previous) => toggleOverviewExpansion(previous, segmentId));
  };

  useEffect(() => {
    if (!previouslyVisibleTags) return;
    const timeout = window.setTimeout(() => setPreviouslyVisibleTags(undefined), 200);
    return () => window.clearTimeout(timeout);
  }, [previouslyVisibleTags]);

  useCalculateNestingLevel({
    targetRef: sentenceRef,
    segment: displayedSegment,
    isTapMode,
    overviewDetails,
    showFullTagNames,
    showTagDescriptions,
    language: i18n.resolvedLanguage,
  });

  return (
    <>
      {hasOverview && (
        <Box position="sticky" insetInlineStart={0} w="fit-content" mb={2} zIndex={3}>
          <AllTagsButton
            expanded={allTagsVisible}
            sentenceId={sentenceId}
            disabled={isEditing}
            isTapMode={isTapMode}
            onClick={(event) => {
              markRevealedTags(event.detail > 0 && !allTagsVisible);
              setToggled(new Set());
              setShowAllTags(!allTagsVisible);
            }}
          />
        </Box>
      )}
      <Sentence ref={sentenceRef} id={sentenceId} isTapMode={isTapMode}>
        <SegmentList
          segment={displayedSegment}
          tokenElements={TokenList({ sentence: analysis.sentence, isTapMode })}
          overview={overviewDetails && { details: overviewDetails, toggle }}
          overviewBaseline={overviewBaseline}
          previouslyVisibleTags={isEditing ? undefined : previouslyVisibleTags}
          descriptionMode={showTagDescriptions ? (isTapMode ? 'tap' : 'hover') : undefined}
        />
      </Sentence>
    </>
  );
}
