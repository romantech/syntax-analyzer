import { Box, chakra, Text } from '@chakra-ui/react';
import { clsx } from 'clsx';
import { useAtomValue } from 'jotai';
import type { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';
import { Tooltip } from '@/base';
import {
  CONSTITUENT_CLASSES,
  CONSTITUENT_COLORS,
  CONSTITUENT_DATA_ATTRS,
  hoveredConstituentAtom,
  isAbbrTooltipVisibleAtom,
  isMultipleTokensInRange,
  type TConstituent,
  useConstituentHover,
} from '@/features/syntax-editor';
import { getConstituentTranslation } from '../../helpers/constituent-translation';

type Disclosure = { expanded: boolean; toggle: (animate: boolean) => void };

interface ConstituentProps {
  tags: TConstituent[];
  begin: number;
  end: number;
  overviewTagId?: number;
  animateLabels: boolean;
  animateExtraLabels: boolean;
  disclosure?: Disclosure;
}

export default function Constituent({
  children,
  tags,
  begin,
  end,
  overviewTagId,
  animateLabels,
  animateExtraLabels,
  disclosure,
}: PropsWithChildren<ConstituentProps>) {
  const primary = tags[0];
  const { dark, light } = CONSTITUENT_COLORS[primary.type];
  const handlers = useConstituentHover();
  const isMultipleTokenRange = isMultipleTokensInRange(begin, end);

  return (
    <Text
      as="span"
      color={light}
      _dark={{ color: dark }}
      className={clsx(CONSTITUENT_CLASSES.CONSTITUENT, {
        [CONSTITUENT_CLASSES.TOKEN_GROUP]: isMultipleTokenRange,
        [CONSTITUENT_CLASSES.TOKEN]: !isMultipleTokenRange,
      })}
      data-constituent-id={primary.id}
      data-segment-begin={begin}
      data-segment-end={end}
      {...handlers}
    >
      {children}
      <span className="constituent-labels">
        {tags.map((tag) => (
          <ConstituentLabel
            key={tag.id}
            tag={tag}
            begin={begin}
            end={end}
            overview={tag.id === overviewTagId}
            entering={animateLabels || (animateExtraLabels && tag.id !== overviewTagId)}
            disclosure={tag.id === overviewTagId ? disclosure : undefined}
          />
        ))}
      </span>
    </Text>
  );
}

function ConstituentLabel({
  tag,
  begin,
  end,
  overview,
  entering,
  disclosure,
}: {
  tag: TConstituent;
  begin: number;
  end: number;
  overview: boolean;
  entering: boolean;
  disclosure?: Disclosure;
}) {
  const { t, i18n } = useTranslation();
  const { name } = getConstituentTranslation(t, tag);
  const showAbbreviationTooltip = useAtomValue(isAbbrTooltipVisibleAtom);
  const hoveredTag = useAtomValue(hoveredConstituentAtom);
  const isTooltipOpen = showAbbreviationTooltip && hoveredTag === tag.id;
  const { dark, light } = CONSTITUENT_COLORS[tag.type];
  const attrs = {
    className: 'constituent-label',
    lang: i18n.resolvedLanguage,
    'data-entering': entering ? true : undefined,
    [CONSTITUENT_DATA_ATTRS.ID]: tag.id,
    [CONSTITUENT_DATA_ATTRS.LABEL]: tag.label,
    [CONSTITUENT_DATA_ATTRS.ABBR]: tag.abbreviation,
  };
  const accessibleLabel = t('editor.constituentLabel', {
    abbr: tag.abbreviation,
    label: name,
    begin: begin + 1,
    end,
  });

  if (overview) {
    return disclosure ? (
      <chakra.button
        {...attrs}
        type="button"
        data-overview-label
        aria-label={t('editor.constituentDetails', { label: name, begin: begin + 1, end })}
        aria-expanded={disclosure.expanded}
        onClick={(event) => disclosure.toggle(event.detail > 0)}
      >
        {name}
        {disclosure.expanded ? <LuChevronUp aria-hidden /> : <LuChevronDown aria-hidden />}
      </chakra.button>
    ) : (
      <span {...attrs} data-overview-label>
        {name}
      </span>
    );
  }

  return (
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
        {...attrs}
        type="button"
        color={light}
        _dark={{ color: dark }}
        aria-label={accessibleLabel}
      >
        <Box as="span" visibility={isTooltipOpen ? 'hidden' : undefined}>
          {tag.abbreviation}
        </Box>
      </chakra.button>
    </Tooltip>
  );
}
