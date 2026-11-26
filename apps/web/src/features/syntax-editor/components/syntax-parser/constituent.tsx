import { chakra, Text } from '@chakra-ui/react';
import { clsx } from 'clsx';
import { useAtomValue } from 'jotai';
import type { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { IoCaretDownSharp } from 'react-icons/io5';
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
import { useLabelWidth } from './use-label-width';

type Disclosure = { expanded: boolean; toggle: (animate: boolean) => void };

interface ConstituentProps {
  tags: TConstituent[];
  begin: number;
  end: number;
  overviewTagId?: number;
  previouslyVisibleTags?: ReadonlySet<number>;
  disclosure?: Disclosure;
}

export default function Constituent({
  children,
  tags,
  begin,
  end,
  overviewTagId,
  previouslyVisibleTags,
  disclosure,
}: PropsWithChildren<ConstituentProps>) {
  const primary = tags[0];
  const colors = primary ? CONSTITUENT_COLORS[primary.type] : undefined;
  const showFullTagNames = useAtomValue(showFullTagNamesAtom);
  const isDeleteMode = useAtomValue(deleteModeAtom);
  const isMultipleTokenRange = isMultipleTokensInRange(begin, end);
  const { labelRef, width } = useLabelWidth(!!disclosure);
  const entering = previouslyVisibleTags && tags.every(({ id }) => !previouslyVisibleTags.has(id));

  // Keep descendant disclosure buttons mounted when an ancestor label appears or disappears.
  return (
    <Text
      as="span"
      display={primary ? undefined : 'contents'}
      color={colors?.light}
      _dark={colors && { color: colors.dark }}
      className={
        primary &&
        clsx(CONSTITUENT_CLASSES.CONSTITUENT, {
          [CONSTITUENT_CLASSES.TOKEN_GROUP]: isMultipleTokenRange,
          [CONSTITUENT_CLASSES.TOKEN]: !isMultipleTokenRange,
        })
      }
      data-constituent-id={primary?.id}
      data-segment-begin={primary ? begin : undefined}
      data-segment-end={primary ? end : undefined}
      data-entering={primary && entering ? true : undefined}
    >
      {children}
      {primary && (
        <span
          className="constituent-labels"
          data-disclosure={!!disclosure || undefined}
          style={{
            width: width === undefined ? undefined : `var(--constituent-label-width, ${width}px)`,
          }}
        >
          <span className="constituent-label-content" ref={labelRef}>
            {tags.map((tag) => (
              <ConstituentLabel
                key={tag.id}
                tag={tag}
                begin={begin}
                end={end}
                abbreviated={!showFullTagNames}
                isDeleteMode={isDeleteMode}
                entering={previouslyVisibleTags?.has(tag.id) === false}
                disclosure={tag.id === overviewTagId ? disclosure : undefined}
              />
            ))}
          </span>
        </span>
      )}
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
        <IoCaretDownSharp aria-hidden />
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
