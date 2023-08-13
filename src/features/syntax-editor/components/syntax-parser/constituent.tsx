import { PropsWithChildren } from 'react';
import { Text, Tooltip, useColorModeValue } from '@chakra-ui/react';
import {
  CONSTITUENT_CLASSES,
  CONSTITUENT_COLORS,
  CONSTITUENT_DATA_ATTRS,
  CONSTITUENT_TRANSLATIONS,
  hoveredConstituentAtom,
  isAbbrTooltipVisibleAtom,
  type TConstituent,
  useConstituentHover,
} from '@/features/syntax-editor';
import { NumberTuple } from '@/base';
import { useAtomValue } from 'jotai';
import { clsx } from 'clsx';

interface ConstituentProps {
  constituent: TConstituent;
  isMultipleTokenRange: boolean;
  begin: number;
  end: number;
}

export default function Constituent({
  children,
  constituent,
  begin,
  end,
  isMultipleTokenRange,
}: PropsWithChildren<ConstituentProps>) {
  const { dark, light } = CONSTITUENT_COLORS[constituent.type];
  const textColor = useColorModeValue(light, dark);

  const isAbbrTooltipVisible = useAtomValue(isAbbrTooltipVisibleAtom);
  const hoveredConstituent = useAtomValue(hoveredConstituentAtom);
  const handlers = useConstituentHover();

  const tooltipOffset: NumberTuple = isMultipleTokenRange ? [0, -10] : [0, 5];
  const koLabel = CONSTITUENT_TRANSLATIONS[constituent.label]?.ko;
  const isCurrentHovered = hoveredConstituent === constituent.id;

  const dataAttrs = {
    [CONSTITUENT_DATA_ATTRS.ID]: constituent.id,
    [CONSTITUENT_DATA_ATTRS.LABEL]: constituent.label,
    [CONSTITUENT_DATA_ATTRS.ABBR]: constituent.abbreviation,
    [CONSTITUENT_DATA_ATTRS.BEGIN]: begin,
    [CONSTITUENT_DATA_ATTRS.END]: end,
  };

  return (
    <Tooltip
      label={koLabel ?? constituent.label}
      textTransform="capitalize"
      offset={tooltipOffset}
      isOpen={isAbbrTooltipVisible && isCurrentHovered}
    >
      <Text
        as="span"
        color={textColor}
        className={clsx(CONSTITUENT_CLASSES.CONSTITUENT, {
          [CONSTITUENT_CLASSES.TOKEN_GROUP]: isMultipleTokenRange,
          [CONSTITUENT_CLASSES.TOKEN]: !isMultipleTokenRange,
        })}
        {...dataAttrs}
        {...handlers}
      >
        {children}
      </Text>
    </Tooltip>
  );
}
