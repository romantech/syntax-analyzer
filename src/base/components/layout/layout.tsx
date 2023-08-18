import React, { PropsWithChildren } from 'react';
import { Container, StackProps, VStack } from '@chakra-ui/react';
import { Header } from '@/base/components';

export function Layout({
  children,
  ...stackProps
}: PropsWithChildren<StackProps>) {
  return (
    <VStack h="100vh" gap={0}>
      <Header />
      <Container maxW="8xl" flexGrow={1} {...stackProps}>
        {children}
      </Container>
    </VStack>
  );
}
