import {
  Popover,
  PopoverAnchor,
  PopoverBody,
  PopoverContent,
  Portal,
  Text,
  TextProps,
} from '@chakra-ui/react';
import {
  CONSTITUENT_DATA_ATTRS,
  invalidRangeIndexAtom,
} from '@/features/syntax-editor';
import { useAtomValue } from 'jotai';

interface TokenProps extends TextProps {
  token: string;
  index: number;
}

export default function Token({ token, index, ...textProps }: TokenProps) {
  const invalidIndex = useAtomValue(invalidRangeIndexAtom);
  const dataAttrs = { [CONSTITUENT_DATA_ATTRS.INDEX]: index };

  return (
    <Popover isOpen={invalidIndex === index} isLazy>
      <PopoverAnchor>
        <Text
          position="relative"
          as="span"
          zIndex={1}
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
