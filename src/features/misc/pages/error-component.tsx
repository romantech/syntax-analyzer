import { Button, Heading, Highlight, type SystemStyleObject, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { type FallbackProps, getErrorMessage } from 'react-error-boundary';
import { isRouteErrorResponse, Navigate, useRouteError } from 'react-router';

import { DIGITS_PATTERN, Layout, LinkParticles } from '@/base';

const preloadErrors = new WeakSet<Error>();

window.addEventListener('vite:preloadError', (event) => {
  const { payload } = event as Event & { payload: unknown };
  if (payload instanceof Error) preloadErrors.add(payload);
});

const highlightStyles: SystemStyleObject = {
  p: '1',
  bg: 'teal.100',
  borderRadius: 'sm',
  fontWeight: 'bold',
};

export default function ErrorComponent({ resetErrorBoundary, error }: Partial<FallbackProps>) {
  const routerError = useRouteError();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const caughtError = error ?? routerError;
  const isPreloadError = caughtError instanceof Error && preloadErrors.has(caughtError);
  const isRouteError = isRouteErrorResponse(routerError);

  let errorMessage = getErrorMessage(error) ?? '문제가 발생했어요';
  let onActionButtonClick = resetErrorBoundary;
  let buttonText = '다시 시도하기';

  if (isPreloadError) {
    errorMessage = '화면을 불러오지 못했어요. 새로고침해 주세요.';
    onActionButtonClick = () => window.location.reload();
    buttonText = '새로고침';
  } else if (isRouteError) {
    const { status, statusText } = routerError;
    errorMessage = `${status} | ${statusText}`;
    onActionButtonClick = () => setShouldRedirect(true);
    buttonText = '돌아가기';
  }

  if (shouldRedirect) return <Navigate to=".." replace />;

  return (
    <Layout
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={8}
      flexGrow={0.9}
    >
      <LinkParticles />
      <motion.div initial={{ opacity: 0, scale: 0.1 }} animate={{ opacity: 1, scale: 1 }}>
        <Heading
          as="h1"
          fontSize={{ base: '6xl', md: '7xl' }}
          fontWeight="extrabold"
          lineHeight={1}
        >
          Ooops!
        </Heading>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.1 }} animate={{ opacity: 1, scale: 1 }}>
        <VStack>
          <Text fontSize="xl" textTransform="capitalize" maxW={500}>
            <Highlight query={errorMessage.match(DIGITS_PATTERN) ?? []} styles={highlightStyles}>
              {errorMessage}
            </Highlight>
          </Text>
          <Button variant="subtle" mt={2} w="full" maxW={232} onClick={onActionButtonClick}>
            {buttonText}
          </Button>
        </VStack>
      </motion.div>
    </Layout>
  );
}
