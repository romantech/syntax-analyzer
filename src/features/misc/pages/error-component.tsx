import {
  Button,
  Heading,
  Highlight,
  ScaleFade,
  SystemStyleObject,
  Text,
  VStack,
} from '@chakra-ui/react';
import { DIGITS_PATTERN, Layout, useIsMounted } from '@/base';
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from 'react-router-dom';
import { useRef } from 'react';
import { FallbackProps } from 'react-error-boundary';

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
  const navigate = useNavigate();

  const isMounted = useIsMounted();
  const errorMessage = useRef(error?.message || '문제가 발생했어요');

  const isRouteError = isRouteErrorResponse(routerError);
  if (isRouteError) {
    const { status, statusText } = routerError;
    errorMessage.current = `${status} | ${statusText}`;
  }

  const onActionButtonClick = isRouteError
    ? () => navigate('..', { replace: true }) // 상위 라우터 계층으로 이동
    : resetErrorBoundary;

  const buttonText = isRouteError ? '돌아가기' : '다시 시도하기';

  return (
    <Layout justify="center" align="center" gap={6} flexGrow={0.9}>
      <ScaleFade initialScale={0.1} in={isMounted}>
        <Heading as="h1" size="4xl">
          Ooops!
        </Heading>
      </ScaleFade>
      <ScaleFade initialScale={0.1} in={isMounted}>
        <VStack>
          <Text fontSize="xl" textTransform="capitalize" maxW={500}>
            <Highlight
              query={errorMessage.current.match(DIGITS_PATTERN)}
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
