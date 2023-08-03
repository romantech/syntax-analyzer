import {
  Box,
  Center,
  CircularProgress,
  CircularProgressLabel,
  Divider,
  HStack,
  StackProps,
  Text,
} from '@chakra-ui/react';

export default function AnalysisCounter({ ...stackProps }: StackProps) {
  return (
    <HStack borderWidth={1} borderRadius="2xl" p={4} w="full" {...stackProps}>
      <CircularProgress size="40px" value={40} color="green.400">
        <CircularProgressLabel fontSize={13}>4회</CircularProgressLabel>
      </CircularProgress>
      <Center height="40px" px={1}>
        <Divider orientation="vertical" />
      </Center>
      <Box>
        <Text fontWeight="bold">남은 분석 횟수 4/12회</Text>
        <Text>
          하루 최대 12회까지 분석할 수 있어요(Model 4는 1번에 3회씩 차감)
        </Text>
      </Box>
    </HStack>
  );
}
