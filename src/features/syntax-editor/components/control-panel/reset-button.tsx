import { IconButton, Tooltip } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import {
  isSegmentTouchedAtom,
  useSyntaxEditorInitializer,
} from '@/features/syntax-editor';
import { MdOutlineRestore } from 'react-icons/md';

export default function ResetButton() {
  const { initializer } = useSyntaxEditorInitializer();
  const isTouched = useAtomValue(isSegmentTouchedAtom);

  return (
    <Tooltip label="저장 상태로 초기화" openDelay={200}>
      <IconButton
        variant="solid"
        aria-label="Reset to saved state"
        fontSize={22}
        icon={<MdOutlineRestore />}
        isDisabled={!isTouched}
        onClick={initializer}
      />
    </Tooltip>
  );
}
