import { Heading, type HeadingProps } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

export default function FieldGroupHeader({
  children,
  ...headingProps
}: PropsWithChildren<HeadingProps>) {
  return (
    <Heading
      fontSize={{ base: '2xl', md: '3xl' }}
      lineHeight={{ base: 1.33, md: 1.2 }}
      pb={4}
      textTransform="uppercase"
      {...headingProps}
    >
      {children}
    </Heading>
  );
}
