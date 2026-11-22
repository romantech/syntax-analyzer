import { Popover, Portal, Text, type TextProps } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';

import {
  CONSTITUENT_DATA_ATTRS,
  deleteModeAtom,
  invalidRangeIndexAtom,
  selectedTagAtom,
  selectedTokenRangeAtom,
} from '@/features/syntax-editor';

interface TokenProps extends TextProps {
  token: string;
  index: number;
  isTapMode: boolean;
}

export default function Token({ token, index, isTapMode, ...textProps }: TokenProps) {
  const { t, i18n } = useTranslation();
  const invalidIndex = useAtomValue(invalidRangeIndexAtom);
  const range = useAtomValue(selectedTokenRangeAtom);
  const selectedTag = useAtomValue(selectedTagAtom);
  const isDeleteMode = useAtomValue(deleteModeAtom);
  const canSelect = isTapMode && !!selectedTag && !isDeleteMode;
  const isSelected =
    canSelect && range && index >= Math.min(...range) && index <= Math.max(...range);
  const dataAttrs = { [CONSTITUENT_DATA_ATTRS.INDEX]: index };

  return (
    <Popover.Root open={!isTapMode && invalidIndex === index} lazyMount autoFocus={false}>
      <Popover.Anchor asChild>
        <Text
          position="relative"
          as="span"
          zIndex={1}
          display={isTapMode ? 'inline-block' : undefined}
          minH={isTapMode ? '44px' : undefined}
          role={canSelect ? 'button' : undefined}
          lang={canSelect ? i18n.resolvedLanguage : undefined}
          tabIndex={canSelect ? 0 : undefined}
          aria-label={canSelect ? t('editor.wordLabel', { index: index + 1, token }) : undefined}
          aria-pressed={canSelect ? !!isSelected : undefined}
          bg={isSelected ? 'teal.muted' : undefined}
          color={isSelected ? 'teal.fg' : undefined}
          borderRadius="sm"
          onPointerDown={(event) => {
            if (canSelect) event.currentTarget.focus({ preventScroll: true });
          }}
          onKeyDown={(event) => {
            if (canSelect && (event.key === 'Enter' || event.key === ' ')) {
              event.preventDefault();
              event.currentTarget.click();
            }
          }}
          {...dataAttrs}
          {...textProps}
        >
          {canSelect ? <span lang="en">{token}</span> : token}
        </Text>
      </Popover.Anchor>
      <Portal>
        <Popover.Positioner>
          <Popover.Content w="fit-content" aria-label={t('editor.rangeHelp')}>
            <Popover.Body role="alert">{t('editor.crossingRange')}</Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
