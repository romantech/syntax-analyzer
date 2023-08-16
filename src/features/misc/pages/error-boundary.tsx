import { Heading, ScaleFade, Text, VStack } from '@chakra-ui/react';
import { Layout, useIsMounted } from '@/base';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { useRef } from 'react';

export default function ErrorBoundary() {
  const error = useRouteError() as Error;

  const isMounted = useIsMounted();
  const errorMessage = useRef(error?.message || '404 | Not Found');

  if (isRouteErrorResponse(error)) {
    const { status, statusText } = error;
    errorMessage.current = `${status} | ${statusText}`;
  }

  return (
    <Layout>
      <VStack justify="center" align="center" minH="90%" gap={4}>
        <ScaleFade initialScale={0.1} in={isMounted}>
          <Heading as="h1" size="4xl">
            Ooops!
          </Heading>
        </ScaleFade>
        <ScaleFade initialScale={0.1} in={isMounted}>
          <Text fontSize="xl" textTransform="capitalize" maxW={500}>
            {errorMessage.current}
          </Text>
        </ScaleFade>
      </VStack>
    </Layout>
  );
}
