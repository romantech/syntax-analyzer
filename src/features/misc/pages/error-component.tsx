import { Button, Heading, Highlight, type SystemStyleObject, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { type FallbackProps, getErrorMessage } from 'react-error-boundary';
import { isRouteErrorResponse, Navigate, useRouteError } from 'react-router';

import { DIGITS_PATTERN, Layout, LinkParticles } from '@/base';

const highlightStyles: SystemStyleObject = {
  p: '1',
  bg: 'teal.100',
  borderRadius: 'sm',
  fontWeight: 'bold',
};

export default function ErrorComponent({ resetErrorBoundary, error }: Partial<FallbackProps>) {
  const routerError = useRouteError() as Error;
  const [shouldRedirect, setShouldRedirect] = useState(false);

  let errorMessage = getErrorMessage(error) ?? '문제가 발생했어요';

  const isRouteError = isRouteErrorResponse(routerError);
  if (isRouteError) {
    const { status, statusText } = routerError;
    errorMessage = `${status} | ${statusText}`;
  }

  const onActionButtonClick = isRouteError ? () => setShouldRedirect(true) : resetErrorBoundary;

  const buttonText = isRouteError ? '돌아가기' : '다시 시도하기';

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
        <Heading as="h1" fontSize="6xl" fontWeight="extrabold" lineHeight={1.2}>
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
