import { PropsWithChildren } from 'react';

import { Container, ContainerProps, VStack } from '@chakra-ui/react';

import { Header } from '@/base/components';

export function Layout({
  children,
  ...containerProps
}: PropsWithChildren<ContainerProps>) {
  return (
    <VStack minH="100vh" gap={0}>
      <Header />
      <Container as="main" maxW="8xl" flexGrow={1} {...containerProps}>
        {children}
      </Container>
    </VStack>
  );
}
