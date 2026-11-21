import { Button, ButtonGroup, Popover, Portal, Tooltip } from '@chakra-ui/react';
import { type ReactElement, useState } from 'react';

interface ConfirmPopoverProps {
  onConfirm: () => void;
  headerText: string;
  tooltipLabel: string;
  tooltipDelay: number;
  children: ReactElement;
}

export default function ConfirmPopover({
  onConfirm,
  headerText,
  tooltipLabel,
  tooltipDelay,
  children,
}: ConfirmPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={(event) => setOpen(event.open)}>
      <Tooltip.Root disabled={open} openDelay={tooltipDelay} closeOnPointerDown>
        <Popover.Trigger asChild>
          <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        </Popover.Trigger>
        <Portal>
          <Tooltip.Positioner>
            <Tooltip.Content>{tooltipLabel}</Tooltip.Content>
          </Tooltip.Positioner>
        </Portal>
      </Tooltip.Root>
      <Portal>
        <Popover.Positioner>
          <Popover.Content w="fit-content" minW={220}>
            <Popover.Arrow>
              <Popover.ArrowTip />
            </Popover.Arrow>
            <Popover.Header border="0" p={4}>
              <Popover.Title>{headerText}</Popover.Title>
            </Popover.Header>
            <Popover.Footer justifyContent="flex-end" border="0">
              <ButtonGroup size="sm">
                <Popover.CloseTrigger asChild aria-label="취소">
                  <Button variant="subtle">취소</Button>
                </Popover.CloseTrigger>
                <Button
                  variant="outline"
                  colorPalette="teal"
                  _light={{ color: 'teal.700' }}
                  onClick={() => {
                    onConfirm();
                    setOpen(false);
                  }}
                >
                  확인
                </Button>
              </ButtonGroup>
            </Popover.Footer>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
