import { Player } from '@lottiefiles/react-lottie-player';
import { Center, CenterProps, Heading, Stack, Text } from '@chakra-ui/react';
import { loadingAnimation } from '@/assets/lottie';
import { useEffect, useRef } from 'react';

interface AnalysisLoadingIndicatorProps extends CenterProps {
  play: boolean;
}

export default function AnalysisLoadingIndicator({
  play,
  ...centerProps
}: AnalysisLoadingIndicatorProps) {
  const playerRef = useRef<Player>(null);

  useEffect(() => {
    /** @see https://dev.to/franklin030601/how-to-use-lottie-animations-react-js-cn0 */
    if (play) playerRef.current?.play();
    else playerRef.current?.stop();
  }, [play]);

  return (
    <Center zIndex={-1} {...centerProps}>
      <Player
        loop
        ref={playerRef}
        src={loadingAnimation}
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
