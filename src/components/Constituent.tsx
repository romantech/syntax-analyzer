import { Constituent as TConstituent } from '@/types/analysis.ts';
import { PropsWithChildren } from 'react';
import { Text, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { CONSTITUENT_COLORS } from '@/constants/constituents.ts';
import { NumberTuple } from '@/types/common.ts';
import { useAtomValue } from 'jotai';
import { abbrTooltipModeAtom } from '@/store/controlPanelStore.ts';

interface ConstituentProps {
  constituent: TConstituent;
}

export default function Constituent({
  children,
  constituent,
}: PropsWithChildren<ConstituentProps>) {
  const { dark, light } = CONSTITUENT_COLORS[constituent.type];
  const colorValue = useColorModeValue(light, dark);
  const abbrTooltipMode = useAtomValue(abbrTooltipModeAtom);

  const offset: NumberTuple = constituent.type !== 'token' ? [0, -10] : [0, 5];

  return (
    <Tooltip
      label={constituent.label}
      textTransform="capitalize"
      offset={offset}
      isDisabled={!abbrTooltipMode}
    >
      <Text
        as="span"
        color={colorValue}
        data-constituent={constituent.abbreviation}
        data-constituent-id={constituent.id}
        className={`constituent ${constituent.type}`}
      >
        {children}
      </Text>
    </Tooltip>
  );
}
