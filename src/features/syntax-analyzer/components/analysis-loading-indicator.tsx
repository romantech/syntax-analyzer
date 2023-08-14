import { Player } from '@lottiefiles/react-lottie-player';
import { Center, CenterProps, Heading, Stack, Text } from '@chakra-ui/react';
import { loadingAnimation } from '@/assets/lottie';

export default function AnalysisLoadingIndicator(centerProps: CenterProps) {
  return (
    <Center zIndex={-1} {...centerProps}>
      <Player
        src={loadingAnimation}
        loop
        autoplay
        style={{ width: 350, height: 350 }}
      />
      <Stack spacing={5}>
        <Heading size="3xl" fontWeight="bold">
          문장 분석 중
        </Heading>
        <Text fontSize="2xl">
          최대
          <Text
            as="span"
            borderRadius="md"
            bg="teal.200"
            color="gray.800"
            mx={1}
            px={1}
          >
            1분
          </Text>
          까지 소요될 수 있어요
        </Text>
      </Stack>
    </Center>
  );
}
