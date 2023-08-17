import React, { PropsWithChildren } from 'react';
import { Container, Flex, Stack, StackProps } from '@chakra-ui/react';
import { Header } from '@/base/components';

export function Layout({
  children,
  ...stackProps
}: PropsWithChildren<StackProps>) {
  return (
    <Container maxW="8xl">
      <Flex direction="column" h="100vh">
        <Header />
        <Stack flexGrow={1} {...stackProps}>
          {children}
        </Stack>
      </Flex>
    </Container>
  );
}
