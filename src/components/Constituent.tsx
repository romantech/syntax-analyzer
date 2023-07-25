import { Constituent as TConstituent } from '@/types/analysis.ts';
import { PropsWithChildren } from 'react';
import { Text } from '@chakra-ui/react';
import { CONSTITUENT_COLORS } from '@/constants/constituents.ts';

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
      color={CONSTITUENT_COLORS[constituent.type]}
      data-constituent={constituent.abbreviation}
      data-constituent-id={constituent.id}
      className={`constituent ${constituent.type}`}
    >
      {children}
    </Text>
  );
}
