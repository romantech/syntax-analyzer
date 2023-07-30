import { Constituent as TConstituent } from '@/types/analysis';
import { PropsWithChildren } from 'react';
import { Text, Tooltip, useColorModeValue } from '@chakra-ui/react';
import {
  CONSTITUENT_CLASSES,
  CONSTITUENT_DATA_ATTRS,
  CONSTITUENT_TRANSLATIONS,
} from '@/constants/constituents';
import { NumberTuple } from '@/types/common';
import { useAtomValue } from 'jotai';
import {
  hoveredConstituentAtom,
  isAbbrTooltipVisibleAtom,
} from '@/store/controlPanelStore';
import { useConstituentHover } from '@/hooks';
import classnames from 'classnames';
import { CONSTITUENT_COLORS } from '@/constants/colors';

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
  const koLabel = CONSTITUENT_TRANSLATIONS[constituent.label]?.ko;
  const isCurrentHovered = hoveredConstituent === constituent.id;

  const dataAttrs = {
    [CONSTITUENT_DATA_ATTRS.CONSTITUENT_ID]: constituent.id,
    [CONSTITUENT_DATA_ATTRS.CONSTITUENT_LABEL]: constituent.label,
    [CONSTITUENT_DATA_ATTRS.CONSTITUENT_ABBR]: constituent.abbreviation,
  };

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
        className={classnames(CONSTITUENT_CLASSES.CONSTITUENT, {
          [CONSTITUENT_CLASSES.TOKEN_GROUP]: isTokenGroup,
          [CONSTITUENT_CLASSES.PHRASE]: constituent.type === 'phrase',
          [CONSTITUENT_CLASSES.CLAUSE]: constituent.type === 'clause',
          [CONSTITUENT_CLASSES.TOKEN]: constituent.type === 'token',
        })}
        {...dataAttrs}
        {...handlers}
      >
        {children}
      </Text>
    </Tooltip>
  );
}
