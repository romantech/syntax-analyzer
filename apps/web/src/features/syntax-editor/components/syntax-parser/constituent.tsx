import { chakra, Text } from '@chakra-ui/react';
import { clsx } from 'clsx';
import { useAtomValue } from 'jotai';
import type { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';
import {
  CONSTITUENT_CLASSES,
  CONSTITUENT_COLORS,
  CONSTITUENT_DATA_ATTRS,
  deleteModeAtom,
  isMultipleTokensInRange,
  showFullTagNamesAtom,
  type TConstituent,
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
  const showFullTagNames = useAtomValue(showFullTagNamesAtom);
  const isDeleteMode = useAtomValue(deleteModeAtom);
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
    >
      {children}
      <span className="constituent-labels">
        {tags.map((tag) => (
          <ConstituentLabel
            key={tag.id}
            tag={tag}
            begin={begin}
            end={end}
            abbreviated={!showFullTagNames}
            isDeleteMode={isDeleteMode}
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
  abbreviated,
  isDeleteMode,
  entering,
  disclosure,
}: {
  tag: TConstituent;
  begin: number;
  end: number;
  abbreviated: boolean;
  isDeleteMode: boolean;
  entering: boolean;
  disclosure?: Disclosure;
}) {
  const { t, i18n } = useTranslation();
  const { name } = getConstituentTranslation(t, tag);
  const text = abbreviated ? tag.abbreviation : name;
  const { dark, light } = CONSTITUENT_COLORS[tag.type];
  const attrs = {
    className: 'constituent-label',
    lang: i18n.resolvedLanguage,
    color: light,
    _dark: { color: dark },
    'data-abbreviated': abbreviated ? true : undefined,
    'data-entering': entering ? true : undefined,
    [CONSTITUENT_DATA_ATTRS.ID]: tag.id,
    [CONSTITUENT_DATA_ATTRS.LABEL]: tag.label,
    [CONSTITUENT_DATA_ATTRS.ABBR]: tag.abbreviation,
  };
  if (disclosure) {
    return (
      <chakra.button
        {...attrs}
        type="button"
        aria-label={t('editor.constituentDetails', { label: text, begin: begin + 1, end })}
        aria-expanded={disclosure.expanded}
        onClick={(event) => disclosure.toggle(event.detail > 0)}
      >
        {text}
        {disclosure.expanded ? <LuChevronUp aria-hidden /> : <LuChevronDown aria-hidden />}
      </chakra.button>
    );
  }

  return isDeleteMode ? (
    <chakra.button
      {...attrs}
      type="button"
      aria-label={t('editor.constituentLabel', {
        abbr: tag.abbreviation,
        label: name,
        begin: begin + 1,
        end,
      })}
    >
      {text}
    </chakra.button>
  ) : (
    <chakra.span {...attrs}>{text}</chakra.span>
  );
}
