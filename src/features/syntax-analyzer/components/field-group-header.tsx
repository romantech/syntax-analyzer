import { PropsWithChildren } from 'react';

import { Heading, HeadingProps } from '@chakra-ui/react';

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
