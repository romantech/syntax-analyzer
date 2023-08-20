import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  HStack,
  Skeleton,
  SkeletonCircle,
  Stack,
  type StackProps,
  Text,
} from '@chakra-ui/react';
import { PropsWithChildren } from 'react';
import {
  DAILY_ANALYSIS_LIMIT,
  useRemainingCountQuery,
} from '@/features/syntax-analyzer';
import { CenteredDivider } from '@/base';

export default function AnalysisCounter({ ...stackProps }: StackProps) {
  const { data: count } = useRemainingCountQuery({
    suspense: true,
    select: ({ analysis }) => analysis,
  });

  const countTitle = `남은 분석 횟수 ${count}회`;
  const limitDesc = `하루 최대 ${DAILY_ANALYSIS_LIMIT}회까지 분석할 수 있어요 (GPT-4 모델은 요청당 3회 차감)`;

  return (
    <AnalysisCounterBox {...stackProps}>
      <CircularProgress
        size="50px"
        value={remainingCountInPercent(count)}
        color="teal.300"
      >
        <CircularProgressLabel>
          {remainingCountInPercent(count) + '%'}
        </CircularProgressLabel>
      </CircularProgress>
      <CenteredDivider orientation="vertical" height="40px" px={1} />
      <Box>
        <Text fontWeight="bold">{countTitle}</Text>
        <Text>{limitDesc}</Text>
      </Box>
    </AnalysisCounterBox>
  );
}

const AnalysisCounterBox = ({
  children,
  ...stackProps
}: PropsWithChildren<StackProps>) => {
  return (
    <HStack
      w="full"
      maxW={660}
      borderWidth={1}
      borderRadius="2xl"
      p={4}
      {...stackProps}
    >
      {children}
    </HStack>
  );
};

const AnalysisCounterSkeleton = (stackProps: StackProps) => {
  return (
    <AnalysisCounterBox {...stackProps}>
      <SkeletonCircle w="50px" h="50px" />
      <Stack>
        <Skeleton h={5} w={200} borderRadius="md" />
        <Skeleton h={5} w={400} borderRadius="md" />
      </Stack>
    </AnalysisCounterBox>
  );
};

const remainingCountInPercent = (count?: number) => {
  if (!count) return 0;
  return Math.round((100 / DAILY_ANALYSIS_LIMIT) * count);
};

AnalysisCounter.Skeleton = AnalysisCounterSkeleton;
