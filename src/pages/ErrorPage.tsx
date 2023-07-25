import { Heading, ScaleFade, Text, useBoolean, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';

export default function ErrorPage() {
  const [show, setShow] = useBoolean();

  useEffect(() => {
    setShow.on();
  }, [setShow]);

  return (
    <VStack justify="center" align="center" minH="90%" gap={4}>
      <ScaleFade initialScale={0.1} in={show}>
        <Heading as="h1" size="4xl">
          Ooops!
        </Heading>
      </ScaleFade>
      <ScaleFade initialScale={0.1} in={true}>
        <Text fontSize="xl" textTransform="uppercase">
          404 | page not found
        </Text>
      </ScaleFade>
    </VStack>
  );
}
