import { Constituent as TConstituent } from '@/types/analysis';
import { PropsWithChildren } from 'react';
import { Text, Tooltip, useColorModeValue } from '@chakra-ui/react';
import {
  CONSTITUENT_COLORS,
  ConstituentTranslations,
} from '@/constants/constituents';
import { NumberTuple } from '@/types/common';
import { useAtomValue } from 'jotai';
import {
  hoveredConstituentAtom,
  isAbbrTooltipVisibleAtom,
} from '@/store/controlPanelStore';
import { useConstituentHover } from '@/hooks';
import classnames from 'classnames';

interface ConstituentProps {
  constituent: TConstituent;
  isTokenGroup: boolean;
}

export default function Constituent({
  children,
  constituent,
  isTokenGroup,
}: PropsWithChildren<ConstituentProps>) {
  const { dark, light } = CONSTITUENT_COLORS[constituent.type];
  const colorValue = useColorModeValue(light, dark);
  const isAbbrTooltipVisible = useAtomValue(isAbbrTooltipVisibleAtom);
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
      isOpen={isAbbrTooltipVisible && isCurrentHovered}
    >
      <Text
        as="span"
        color={colorValue}
        data-constituent={constituent.abbreviation}
        data-constituent-id={constituent.id}
        className={classnames('constituent', constituent.type, {
          'token-group': isTokenGroup && constituent.type === 'token',
        })}
        {...handlers}
      >
        {children}
      </Text>
    </Tooltip>
  );
}
