import { IconButton, Tooltip } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import {
  isSegmentTouchedAtom,
  useSyntaxEditorInitializer,
} from '@/features/syntax-editor';
import { MdOutlineRestore } from 'react-icons/md';
import { ConfirmPopover } from '@/base';

export default function ResetButton() {
  const { initializer } = useSyntaxEditorInitializer();
  const isTouched = useAtomValue(isSegmentTouchedAtom);

  return (
    <ConfirmPopover
      onConfirm={initializer}
      headerText="초기화 하시겠습니까?"
      gutter={-18}
    >
      {({ onOpen, isOpen }) => (
        <Tooltip
          label="저장 상태로 초기화"
          openDelay={200}
          closeOnPointerDown
          isDisabled={isOpen}
        >
          <IconButton
            variant="solid"
            aria-label="Reset to saved state"
            fontSize={22}
            icon={<MdOutlineRestore />}
            isDisabled={!isTouched}
            onClick={onOpen}
          />
        </Tooltip>
      )}
    </ConfirmPopover>
  );
}
