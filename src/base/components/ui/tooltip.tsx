import { Tooltip as ChakraTooltip, Portal } from '@chakra-ui/react';
import type { ReactElement, ReactNode } from 'react';

interface TooltipProps extends Pick<ChakraTooltip.RootProps, 'open' | 'openDelay' | 'positioning'> {
  label: ReactNode;
  children: ReactElement;
  contentProps?: ChakraTooltip.ContentProps;
}

export default function Tooltip({ label, children, contentProps, ...rootProps }: TooltipProps) {
  return (
    <ChakraTooltip.Root lazyMount {...rootProps}>
      <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
      <Portal>
        <ChakraTooltip.Positioner>
          <ChakraTooltip.Content {...contentProps}>{label}</ChakraTooltip.Content>
        </ChakraTooltip.Positioner>
      </Portal>
    </ChakraTooltip.Root>
  );
}
