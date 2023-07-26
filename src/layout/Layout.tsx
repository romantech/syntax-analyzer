import React, { PropsWithChildren } from 'react';
import { Box, Container, Flex } from '@chakra-ui/react';
import Header from '@/layout/Header.tsx';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Container minW="90%">
      <Flex direction="column" h="100vh">
        <Header />
        <Box flex="1">{children}</Box>
      </Flex>
    </Container>
  );
}
