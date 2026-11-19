import { Box, Text, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { clsx } from 'clsx';
import { useAtomValue } from 'jotai';
import type { PropsWithChildren } from 'react';

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

interface ConstituentProps {
  constituent: TConstituent;
  isMultipleTokenRange: boolean;
  begin: number;
  end: number;
}

const abbrTooltipModifiers = [
  {
    name: 'offset',
    options: {
      offset: ({
        reference,
        popper,
      }: {
        reference: { height: number };
        popper: { height: number };
      }) => [0, -(reference.height + popper.height) / 2],
    },
  },
];

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
  const koLabel = CONSTITUENT_TRANSLATIONS[constituent.label]?.ko;
  const isTooltipOpen = isAbbrTooltipVisible && hoveredConstituent === constituent.id;

  const dataAttrs = {
    [CONSTITUENT_DATA_ATTRS.ID]: constituent.id,
    [CONSTITUENT_DATA_ATTRS.LABEL]: constituent.label,
    [CONSTITUENT_DATA_ATTRS.ABBR]: constituent.abbreviation,
    [CONSTITUENT_DATA_ATTRS.BEGIN]: begin,
    [CONSTITUENT_DATA_ATTRS.END]: end,
  };

  return (
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
      <Tooltip
        label={koLabel ?? constituent.label}
        fontWeight="semibold"
        textTransform="capitalize"
        modifiers={abbrTooltipModifiers}
        isOpen={isTooltipOpen}
      >
        <Box
          as="button"
          type="button"
          className="constituent-label"
          aria-label={`${constituent.abbreviation}: ${koLabel ?? constituent.label} (${begin + 1}~${end} 단어)`}
          _focusVisible={{ outline: '2px solid', outlineOffset: '2px' }}
        >
          <Box as="span" visibility={isTooltipOpen ? 'hidden' : undefined}>
            {constituent.abbreviation}
          </Box>
        </Box>
      </Tooltip>
    </Text>
  );
}
