import { Heading, HeadingProps, Stack } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

interface FieldWithHeadingProps extends HeadingProps {
  headingText: string;
}

export default function FieldWithHeading({
  children,
  headingText,
  ...headingProps
}: PropsWithChildren<FieldWithHeadingProps>) {
  return (
    <Stack>
      <Heading size="lg" mb={4} textTransform="uppercase" {...headingProps}>
        {headingText}
      </Heading>
      {children}
    </Stack>
  );
}
