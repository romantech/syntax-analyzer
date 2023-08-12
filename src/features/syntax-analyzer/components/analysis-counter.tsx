import {
  Box,
  Center,
  CircularProgress,
  CircularProgressLabel,
  Divider,
  HStack,
  Skeleton,
  SkeletonCircle,
  Stack,
  type StackProps,
  Text,
} from '@chakra-ui/react';
import { PropsWithChildren } from 'react';
import {
  MAX_ANALYSIS_COUNT,
  useRemainingCount,
} from '@/features/syntax-analyzer';

export default function AnalysisCounter({ ...stackProps }: StackProps) {
  const { data: count } = useRemainingCount({
    suspense: true,
    select: ({ count }) => count,
  });

  const countTitle = `남은 분석 횟수 ${count}회`;
  const limitDesc = `하루 최대 ${MAX_ANALYSIS_COUNT}회까지 분석할 수 있어요 (GPT-4 모델은 요청당 3회씩 차감)`;

  return (
    <AnalysisCounterBox maxW={690} {...stackProps}>
      <CircularProgress
        size="50px"
        value={remainingCountInPercent(count)}
        color="green.400"
      >
        <CircularProgressLabel>
          {remainingCountInPercent(count) + '%'}
        </CircularProgressLabel>
      </CircularProgress>

      <Center height="40px" px={1}>
        <Divider orientation="vertical" />
      </Center>
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
    <HStack borderWidth={1} borderRadius="2xl" p={4} {...stackProps}>
      {children}
    </HStack>
  );
};

const AnalysisCounterSkeleton = (stackProps: StackProps) => {
  return (
    <AnalysisCounterBox maxW={690} {...stackProps}>
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
  return Math.round((100 / MAX_ANALYSIS_COUNT) * count);
};

AnalysisCounter.Skeleton = AnalysisCounterSkeleton;
