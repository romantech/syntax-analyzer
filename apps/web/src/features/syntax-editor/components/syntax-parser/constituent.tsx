import { Box, chakra, Text } from '@chakra-ui/react';
import { clsx } from 'clsx';
import { useAtomValue } from 'jotai';
import type { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@/base';
import {
  CONSTITUENT_CLASSES,
  CONSTITUENT_COLORS,
  CONSTITUENT_DATA_ATTRS,
  hoveredConstituentAtom,
  isAbbrTooltipVisibleAtom,
  type TConstituent,
  useConstituentHover,
} from '@/features/syntax-editor';
import { getConstituentTranslation } from '../../helpers/constituent-translation';

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
  const { t, i18n } = useTranslation();
  const { dark, light } = CONSTITUENT_COLORS[constituent.type];

  const isAbbrTooltipVisible = useAtomValue(isAbbrTooltipVisibleAtom);
  const hoveredConstituent = useAtomValue(hoveredConstituentAtom);
  const handlers = useConstituentHover();
  const { name } = getConstituentTranslation(t, constituent);
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
      color={light}
      _dark={{ color: dark }}
      className={clsx(CONSTITUENT_CLASSES.CONSTITUENT, {
        [CONSTITUENT_CLASSES.TOKEN_GROUP]: isMultipleTokenRange,
        [CONSTITUENT_CLASSES.TOKEN]: !isMultipleTokenRange,
      })}
      {...dataAttrs}
      {...handlers}
    >
      {children}
      <Tooltip
        label={name}
        open={isTooltipOpen}
        positioning={{
          placement: 'top',
          gutter: 0,
          flip: false,
          getAnchorRect: (anchor) => {
            const rect = anchor?.getBoundingClientRect();
            return rect
              ? { x: rect.x, y: rect.y + rect.height / 2, width: rect.width, height: 0 }
              : null;
          },
        }}
        contentProps={{
          fontWeight: 'semibold',
          textTransform: 'capitalize',
          css: { translate: '0 50%' },
        }}
      >
        <chakra.button
          type="button"
          lang={i18n.resolvedLanguage}
          className="constituent-label"
          aria-label={t('editor.constituentLabel', {
            abbr: constituent.abbreviation,
            label: name,
            begin: begin + 1,
            end,
          })}
        >
          <Box as="span" visibility={isTooltipOpen ? 'hidden' : undefined}>
            {constituent.abbreviation}
          </Box>
        </chakra.button>
      </Tooltip>
    </Text>
  );
}
