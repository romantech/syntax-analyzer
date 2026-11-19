import { Center, type CenterProps, Separator, type SeparatorProps } from '@chakra-ui/react';

interface CenteredDividerProps extends CenterProps {
  orientation?: 'horizontal' | 'vertical';
  dividerH?: SeparatorProps['h'];
  dividerW?: SeparatorProps['w'];
}

export default function CenteredDivider({
  orientation = 'horizontal',
  dividerH,
  dividerW,
  ...centerProps
}: CenteredDividerProps) {
  return (
    <Center {...centerProps}>
      <Separator
        h={dividerH ?? (orientation === 'vertical' ? 'full' : undefined)}
        w={dividerW ?? (orientation === 'horizontal' ? 'full' : undefined)}
        orientation={orientation}
      />
    </Center>
  );
}
