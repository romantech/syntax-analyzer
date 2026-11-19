import { IconButton } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { MdOutlineRestore } from 'react-icons/md';

import { ConfirmPopover } from '@/base';
import {
  CONTROL_OPEN_POPUP_DELAY,
  isSegmentTouchedAtom,
  useSyntaxEditorInitializer,
} from '@/features/syntax-editor';

export default function ResetButton() {
  const { initializer } = useSyntaxEditorInitializer();
  const isTouched = useAtomValue(isSegmentTouchedAtom);

  return (
    <ConfirmPopover
      onConfirm={initializer}
      headerText="저장 상태로 초기화 하시겠습니까?"
      tooltipLabel="저장 상태로 초기화"
      tooltipDelay={CONTROL_OPEN_POPUP_DELAY}
    >
      <IconButton variant="subtle" aria-label="Reset to saved state" disabled={!isTouched}>
        <MdOutlineRestore />
      </IconButton>
    </ConfirmPopover>
  );
}
