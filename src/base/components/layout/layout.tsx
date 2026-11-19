import { Container, type ContainerProps, VStack } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

import { Header } from '@/base/components';

export function Layout({
  children,
  fitViewport,
  ...containerProps
}: PropsWithChildren<ContainerProps & { fitViewport?: boolean }>) {
  return (
    <VStack
      minH="100vh"
      h={fitViewport ? '100vh' : undefined}
      sx={{
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
