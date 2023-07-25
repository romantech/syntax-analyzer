import { Heading, ScaleFade, Text, VStack } from '@chakra-ui/react';

export default function ErrorPage() {
  return (
    <VStack justify="center" align="center" minH="90%">
      <ScaleFade initialScale={0.1} in={true}>
        <Heading as="h1" size="4xl">
          Ooops!
        </Heading>
        <Text fontSize="xl" textTransform="uppercase">
          404 | page not found
        </Text>
      </ScaleFade>
    </VStack>
  );
}
