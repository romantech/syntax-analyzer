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

import { CenteredDivider } from '@/base';
import {
  ANALYSIS_DECREMENT_COUNT,
  AnalysisModel,
  DAILY_ANALYSIS_LIMIT,
  useRemainingCountQuery,
} from '@/features/syntax-analyzer';

export default function AnalysisCounter({ ...stackProps }: StackProps) {
  const { data: count } = useRemainingCountQuery({
    select: ({ analysis }) => analysis,
  });

  return (
    <AnalysisCounterBox
      {...stackProps}
      countLabel={<Text fontWeight="bold">남은 분석 횟수 {count}회</Text>}
    >
      <ProgressCircle.Root flexShrink={0} value={remainingCountInPercent(count)}>
        <ProgressCircle.Circle
          aria-label="Remaining analysis count"
          css={{ '--size': '50px', '--thickness': '5px' }}
        >
          <ProgressCircle.Track stroke="gray.200" />
          <ProgressCircle.Range stroke="teal.300" />
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
  return (
    <HStack w="full" maxW={660} borderWidth={1} borderRadius="2xl" p={4} {...stackProps}>
      {children}
      <CenteredDivider orientation="vertical" height="40px" px={1} />
      <Box minW={0}>
        {countLabel}
        <Text>
          하루 최대 {DAILY_ANALYSIS_LIMIT}회까지 분석할 수 있어요 (고급 모델은 요청당{' '}
          {ANALYSIS_DECREMENT_COUNT[AnalysisModel.PRIMARY]}회 차감)
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
