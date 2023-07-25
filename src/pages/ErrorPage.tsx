import { Heading, Text, VStack } from '@chakra-ui/react';

export default function ErrorPage() {
  return (
    <VStack justify="center" align="center" minH="90%">
      <Heading as="h1" size="4xl">
        Ooops!
      </Heading>
      <Text fontSize="xl" textTransform="uppercase">
        404 | page not found
      </Text>
    </VStack>
  );
}
