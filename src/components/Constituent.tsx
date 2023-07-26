import { Constituent as TConstituent } from '@/types/analysis.ts';
import { PropsWithChildren } from 'react';
import { Text, Tooltip, useColorModeValue } from '@chakra-ui/react';
import {
  CONSTITUENT_COLORS,
  ConstituentTranslations,
} from '@/constants/constituents.ts';
import { NumberTuple } from '@/types/common.ts';
import { useAtomValue } from 'jotai';
import { abbrInfoMode, deleteModeAtom } from '@/store/controlPanelStore.ts';

interface ConstituentProps {
  constituent: TConstituent;
}

export default function Constituent({
  children,
  constituent,
}: PropsWithChildren<ConstituentProps>) {
  const { dark, light } = CONSTITUENT_COLORS[constituent.type];
  const colorValue = useColorModeValue(light, dark);
  const abbrTooltipMode = useAtomValue(abbrInfoMode);
  const isDeleteMode = useAtomValue(deleteModeAtom);

  const offset: NumberTuple = constituent.type !== 'token' ? [0, -10] : [0, 5];
  const koLabel = ConstituentTranslations[constituent.label]?.ko;

  return (
    <Tooltip
      label={koLabel ?? constituent.label}
      textTransform="capitalize"
      offset={offset}
      isDisabled={!abbrTooltipMode || isDeleteMode}
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
