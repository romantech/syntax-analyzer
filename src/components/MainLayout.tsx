import React, { PropsWithChildren } from 'react';
import { Container } from '@chakra-ui/react';
import Header from '@/components/Header.tsx';

interface MainLayoutProps {}

export default function MainLayout({
  children,
}: PropsWithChildren<MainLayoutProps>) {
  return (
    <Container maxW="8xl">
      <Header />
      <Container>{children}</Container>
    </Container>
  );
}
