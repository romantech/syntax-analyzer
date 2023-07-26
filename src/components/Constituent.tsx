import { Constituent as TConstituent } from '@/types/analysis.ts';
import { PropsWithChildren } from 'react';
import { Text, Tooltip, useColorModeValue } from '@chakra-ui/react';
import {
  CONSTITUENT_COLORS,
  ConstituentTranslations,
} from '@/constants/constituents.ts';
import { NumberTuple } from '@/types/common.ts';
import { useAtomValue } from 'jotai';
import { shouldOpenAbbrTooltipAtom } from '@/store/controlPanelStore.ts';
import { hoveredConstituentAtom } from '@/store/analysisStore.ts';
import { useConstituentHover } from '@/hooks';

interface ConstituentProps {
  constituent: TConstituent;
}

export default function Constituent({
  children,
  constituent,
}: PropsWithChildren<ConstituentProps>) {
  const { dark, light } = CONSTITUENT_COLORS[constituent.type];
  const colorValue = useColorModeValue(light, dark);
  const canShowTooltip = useAtomValue(shouldOpenAbbrTooltipAtom);
  const hoveredConstituent = useAtomValue(hoveredConstituentAtom);
  const handlers = useConstituentHover();

  const offset: NumberTuple = constituent.type !== 'token' ? [0, -10] : [0, 5];
  const koLabel = ConstituentTranslations[constituent.label]?.ko;
  const isCurrentHovered = hoveredConstituent === constituent.id;

  return (
    <Tooltip
      label={koLabel ?? constituent.label}
      textTransform="capitalize"
      offset={offset}
      isOpen={canShowTooltip && isCurrentHovered}
    >
      <Text
        as="span"
        color={colorValue}
        data-constituent={constituent.abbreviation}
        data-constituent-id={constituent.id}
        className={`constituent ${constituent.type}`}
        {...handlers}
      >
        {children}
      </Text>
    </Tooltip>
  );
}
