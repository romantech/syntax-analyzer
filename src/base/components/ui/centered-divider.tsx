import { Center, CenterProps, Divider, DividerProps } from '@chakra-ui/react';

interface CenteredDividerProps extends CenterProps {
  orientation?: 'horizontal' | 'vertical';
  dividerH?: DividerProps['h'];
  dividerW?: DividerProps['w'];
}

export default function CenteredDivider({
  orientation = 'horizontal',
  dividerH,
  dividerW,
  ...centerProps
}: CenteredDividerProps) {
  return (
    <Center {...centerProps}>
      <Divider h={dividerH} w={dividerW} orientation={orientation} />
    </Center>
  );
}
