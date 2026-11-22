import { Container, type ContainerProps, VStack } from '@chakra-ui/react';
import { type PropsWithChildren, useLayoutEffect } from 'react';

import { Header } from '@/base/components';

export function Layout({
  children,
  fitViewport,
  lang = 'ko',
  ...containerProps
}: PropsWithChildren<ContainerProps & { fitViewport?: boolean }>) {
  useLayoutEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <VStack
      minH="100vh"
      h={fitViewport ? '100vh' : undefined}
      css={{
        '@supports (height: 100dvh)': {
          minH: '100dvh',
          h: fitViewport ? '100dvh' : undefined,
        },
      }}
      gap={0}
    >
      <Header />
      <Container as="main" maxW="8xl" flexGrow={1} {...containerProps}>
        {children}
      </Container>
    </VStack>
  );
}
