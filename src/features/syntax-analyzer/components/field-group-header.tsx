import { Heading, type HeadingProps } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

export default function FieldGroupHeader({
  children,
  ...headingProps
}: PropsWithChildren<HeadingProps>) {
  return (
    <Heading size="lg" pb={4} textTransform="uppercase" {...headingProps}>
      {children}
    </Heading>
  );
}
