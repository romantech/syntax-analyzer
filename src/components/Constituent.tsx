import { Constituent as TConstituent } from '@/types/analysis.ts';
import { PropsWithChildren } from 'react';
import { Text } from '@chakra-ui/react';

interface ConstituentProps {
  constituent: TConstituent;
}

export default function Constituent({
  children,
  constituent,
}: PropsWithChildren<ConstituentProps>) {
  return (
    <Text
      as="span"
      data-constituent-label={constituent.label}
      data-constituent-id={constituent.id}
    >
      {children}
    </Text>
  );
}
