import {
  Box,
  HStack,
  ProgressCircle,
  Skeleton,
  SkeletonCircle,
  type StackProps,
  Text,
} from '@chakra-ui/react';
import type { PropsWithChildren, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { CenteredDivider } from '@/base';
import {
  ANALYSIS_DECREMENT_COUNT,
  AnalysisModel,
  DAILY_ANALYSIS_LIMIT,
  useRemainingCountQuery,
} from '@/features/syntax-analyzer';

export default function AnalysisCounter({ ...stackProps }: StackProps) {
  const { t } = useTranslation();
  const { data: count } = useRemainingCountQuery({
    select: ({ analysis }) => analysis,
  });

  return (
    <AnalysisCounterBox
      {...stackProps}
      countLabel={<Text fontWeight="bold">{t('analyzer.remaining', { remaining: count })}</Text>}
    >
      <ProgressCircle.Root
        colorPalette="teal"
        flexShrink={0}
        value={remainingCountInPercent(count)}
      >
        <ProgressCircle.Circle
          aria-label={t('analyzer.remainingLabel')}
          css={{ '--size': '50px', '--thickness': '5px' }}
        >
          <ProgressCircle.Track _light={{ stroke: 'teal.subtle' }} />
          <ProgressCircle.Range />
        </ProgressCircle.Circle>
        <ProgressCircle.ValueText
          position="absolute"
          inset={0}
          display="grid"
          placeItems="center"
        />
      </ProgressCircle.Root>
    </AnalysisCounterBox>
  );
}

const AnalysisCounterBox = ({
  children,
  countLabel,
  ...stackProps
}: PropsWithChildren<StackProps & { countLabel: ReactNode }>) => {
  const { t } = useTranslation();
  return (
    <HStack w="full" maxW={660} borderWidth={1} borderRadius="2xl" p={4} {...stackProps}>
      {children}
      <CenteredDivider orientation="vertical" height="40px" px={1} />
      <Box minW={0}>
        {countLabel}
        <Text>
          {t('analyzer.dailyLimit', {
            limit: DAILY_ANALYSIS_LIMIT,
            cost: ANALYSIS_DECREMENT_COUNT[AnalysisModel.PRIMARY],
          })}
        </Text>
      </Box>
    </HStack>
  );
};

const AnalysisCounterSkeleton = (stackProps: StackProps) => {
  return (
    <AnalysisCounterBox
      {...stackProps}
      countLabel={<Skeleton aria-hidden h={6} maxW={128} borderRadius="md" />}
    >
      <SkeletonCircle aria-hidden size="50px" />
    </AnalysisCounterBox>
  );
};

const remainingCountInPercent = (count?: number) => {
  if (!count) return 0;
  return Math.round((100 / DAILY_ANALYSIS_LIMIT) * count);
};

AnalysisCounter.Skeleton = AnalysisCounterSkeleton;
