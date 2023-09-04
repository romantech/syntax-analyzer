import { PropsWithChildren } from 'react';

import { Tooltip, TooltipProps } from '@chakra-ui/react';

export default function UsageLimitTooltip({
  children,
  ...tooltipProps
}: PropsWithChildren<TooltipProps>) {
  return (
    <Tooltip
      label={'사용량을 모두 소진했어요\n내일 다시 시도해주세요'}
      placement="top"
      whiteSpace="pre-line"
      {...tooltipProps}
    >
      {children}
    </Tooltip>
  );
}
