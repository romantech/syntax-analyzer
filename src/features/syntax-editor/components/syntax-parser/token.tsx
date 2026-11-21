import { Popover, Portal, Text, type TextProps } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';

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
          tabIndex={canSelect ? 0 : undefined}
          lang={canSelect ? 'ko' : undefined}
          aria-label={canSelect ? `${index + 1}번째 단어: ${token}` : undefined}
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
          {token}
        </Text>
      </Popover.Anchor>
      <Portal>
        <Popover.Positioner>
          <Popover.Content w="fit-content" aria-label="태깅 범위 안내">
            <Popover.Body role="alert">구/절은 서로 교차할 수 없어요</Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
