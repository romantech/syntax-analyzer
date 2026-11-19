import {
  Popover,
  PopoverAnchor,
  PopoverBody,
  PopoverContent,
  Portal,
  Text,
  type TextProps,
  useColorModeValue,
} from '@chakra-ui/react';
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
  const selectionColor = useColorModeValue('teal.100', 'teal.800');
  const selectionTextColor = useColorModeValue('gray.800', 'gray.50');
  const canSelect = isTapMode && !!selectedTag && !isDeleteMode;
  const isSelected =
    canSelect && range && index >= Math.min(...range) && index <= Math.max(...range);
  const dataAttrs = { [CONSTITUENT_DATA_ATTRS.INDEX]: index };

  return (
    <Popover isOpen={!isTapMode && invalidIndex === index} isLazy>
      <PopoverAnchor>
        <Text
          position="relative"
          as="span"
          zIndex={1}
          display={isTapMode ? 'inline-block' : undefined}
          minH={isTapMode ? '44px' : undefined}
          role={canSelect ? 'button' : undefined}
          tabIndex={canSelect ? 0 : undefined}
          aria-label={canSelect ? `${index + 1}번째 단어: ${token}` : undefined}
          aria-pressed={canSelect ? !!isSelected : undefined}
          bg={isSelected ? selectionColor : undefined}
          color={isSelected ? selectionTextColor : undefined}
          borderRadius="sm"
          _focusVisible={{ outline: '2px solid', outlineOffset: '2px' }}
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
      </PopoverAnchor>
      <Portal>
        <PopoverContent w="fit-content">
          <PopoverBody>구/절은 서로 교차할 수 없어요</PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
