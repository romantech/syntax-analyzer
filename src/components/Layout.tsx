import React, { PropsWithChildren } from 'react';
import { Container } from '@chakra-ui/react';
import Header from '@/components/Header.tsx';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Container maxW="8xl">
      <Header />
      <Container>{children}</Container>
    </Container>
  );
}
