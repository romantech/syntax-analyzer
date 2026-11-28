import { Portal, Tooltip, useTooltip } from '@chakra-ui/react';
import { type ReactElement, useEffect, useRef } from 'react';

export default function TagDescription({
  children,
  description,
  name,
  language,
  tapToToggle = false,
}: {
  children: ReactElement;
  description: string;
  name?: string;
  language?: string;
  tapToToggle?: boolean;
}) {
  const trigger = useRef<HTMLButtonElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const tooltip = useTooltip({
    closeOnClick: !tapToToggle,
    interactive: true,
    positioning: { strategy: 'fixed', placement: 'top' },
  });
  const { open, setOpen } = tooltip;

  useEffect(() => {
    if (!open || !tapToToggle) return;
    const closeOutside = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return;
      if (!trigger.current?.contains(event.target) && !content.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', closeOutside, true);
    return () => document.removeEventListener('pointerdown', closeOutside, true);
  }, [open, setOpen, tapToToggle]);

  return (
    <Tooltip.RootProvider value={tooltip} lazyMount unmountOnExit>
      <Tooltip.Trigger
        asChild
        ref={trigger}
        onClick={tapToToggle ? () => setOpen(!open) : undefined}
      >
        {children}
      </Tooltip.Trigger>
      <Portal>
        <Tooltip.Positioner>
          <Tooltip.Content
            ref={content}
            lang={language}
            maxW="min(20rem, calc(100vw - 16px))"
            whiteSpace="normal"
          >
            {name && (
              <strong>
                {name}
                <br />
              </strong>
            )}
            {description}
          </Tooltip.Content>
        </Tooltip.Positioner>
      </Portal>
    </Tooltip.RootProvider>
  );
}
