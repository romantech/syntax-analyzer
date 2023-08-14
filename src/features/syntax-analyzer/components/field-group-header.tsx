import { Heading, HeadingProps } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

export default function FieldGroupHeader({
  children,
  ...headingProps
}: PropsWithChildren<HeadingProps>) {
  return (
    <Heading size="lg" mb={4} textTransform="uppercase" {...headingProps}>
      {children}
    </Heading>
  );
}
