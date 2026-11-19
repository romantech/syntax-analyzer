import { Container, type ContainerProps, VStack } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

import { Header } from '@/base/components';

export function Layout({ children, ...containerProps }: PropsWithChildren<ContainerProps>) {
  return (
    <VStack minH="100vh" sx={{ '@supports (height: 100dvh)': { minH: '100dvh' } }} gap={0}>
      <Header />
      <Container as="main" maxW="8xl" flexGrow={1} {...containerProps}>
        {children}
      </Container>
    </VStack>
  );
}
