import { Button, Heading, Highlight, type SystemStyleObject, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import type { FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { isRouteErrorResponse, Navigate, useRouteError } from 'react-router';

import { DIGITS_PATTERN, Layout, LinkParticles } from '@/base';

const preloadErrors = new WeakSet<Error>();

window.addEventListener('vite:preloadError', (event) => {
  const { payload } = event as Event & { payload: unknown };
  if (payload instanceof Error) preloadErrors.add(payload);
});

const highlightStyles: SystemStyleObject = {
  p: '1',
  bg: 'teal.subtle',
  color: 'teal.fg',
  borderRadius: 'sm',
  fontWeight: 'bold',
};

export default function ErrorComponent({ resetErrorBoundary, error }: Partial<FallbackProps>) {
  const { t } = useTranslation();
  const routerError = useRouteError();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const caughtError = error ?? routerError;
  const isPreloadError = caughtError instanceof Error && preloadErrors.has(caughtError);
  const isRouteError = isRouteErrorResponse(routerError);

  let errorMessage: string = t('common.genericError');
  let onActionButtonClick = resetErrorBoundary;
  let buttonText: string = t('common.tryAgain');

  if (isPreloadError) {
    errorMessage = t('common.reloadError');
    onActionButtonClick = () => window.location.reload();
    buttonText = t('common.reload');
  } else if (isRouteError) {
    const { status, statusText } = routerError;
    errorMessage = `${status} | ${statusText}`;
    onActionButtonClick = () => setShouldRedirect(true);
    buttonText = t('common.goBack');
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
          fontSize={{ base: '3xl', md: '5xl' }}
          textAlign="center"
          fontWeight="extrabold"
          lineHeight={1}
        >
          {t('common.errorHeading')}
        </Heading>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.1 }} animate={{ opacity: 1, scale: 1 }}>
        <VStack>
          <Text lang={isRouteError ? 'en' : undefined} fontSize="xl" maxW={500}>
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
