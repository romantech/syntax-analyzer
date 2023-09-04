import {
  Button,
  Heading,
  Highlight,
  ScaleFade,
  SystemStyleObject,
  Text,
  useBoolean,
  VStack,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { FallbackProps } from 'react-error-boundary';
import {
  isRouteErrorResponse,
  Navigate,
  useRouteError,
} from 'react-router-dom';

import { DIGITS_PATTERN, Layout, LinkParticles, useIsMounted } from '@/base';

const highlightStyles: SystemStyleObject = {
  p: '1',
  bg: 'teal.100',
  borderRadius: 'sm',
  fontWeight: 'bold',
};

export default function ErrorComponent({
  resetErrorBoundary,
  error,
}: Partial<FallbackProps>) {
  const routerError = useRouteError() as Error;
  const [shouldRedirect, setShouldRedirect] = useBoolean(false);

  const isMounted = useIsMounted();
  const errorMessage = useRef(error?.message ?? '문제가 발생했어요');

  const isRouteError = isRouteErrorResponse(routerError);
  if (isRouteError) {
    const { status, statusText } = routerError;
    errorMessage.current = `${status} | ${statusText}`;
  }

  const onActionButtonClick = isRouteError
    ? () => setShouldRedirect.on()
    : resetErrorBoundary;

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
      <ScaleFade initialScale={0.1} in={isMounted}>
        <Heading as="h1" size="4xl" fontWeight="extrabold">
          Ooops!
        </Heading>
      </ScaleFade>
      <ScaleFade initialScale={0.1} in={isMounted}>
        <VStack>
          <Text fontSize="xl" textTransform="capitalize" maxW={500}>
            <Highlight
              query={errorMessage.current.match(DIGITS_PATTERN) ?? []}
              styles={highlightStyles}
            >
              {errorMessage.current}
            </Highlight>
          </Text>
          <Button mt={2} w="full" maxW={232} onClick={onActionButtonClick}>
            {buttonText}
          </Button>
        </VStack>
      </ScaleFade>
    </Layout>
  );
}
