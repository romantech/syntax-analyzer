import { Heading, ScaleFade, Text, VStack } from '@chakra-ui/react';
import { useIsMounted } from '@/hooks';
import { Layout } from '@/layout';

export default function ErrorPage() {
  const isMounted = useIsMounted();

  return (
    <Layout>
      <VStack justify="center" align="center" minH="90%" gap={4}>
        <ScaleFade initialScale={0.1} in={isMounted}>
          <Heading as="h1" size="4xl">
            Ooops!
          </Heading>
        </ScaleFade>
        <ScaleFade initialScale={0.1} in={isMounted}>
          <Text fontSize="xl" textTransform="uppercase">
            404 | page not found
          </Text>
        </ScaleFade>
      </VStack>
    </Layout>
  );
}
