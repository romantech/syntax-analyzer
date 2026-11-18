import { Stack, type StackProps } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

interface LoadingFadeProps extends StackProps {
  isLoading: boolean;
  type: 'content' | 'indicator';
}

export default function LoadingTransition({
  children,
  isLoading,
  type,
  ...stackProps
}: PropsWithChildren<LoadingFadeProps>) {
  const getStyleFunc = type === 'content' ? getContentFadeStyles : getLoadingFadeStyles;

  const props = { ...getStyleFunc(isLoading), ...stackProps };

  return <Stack {...props}>{children}</Stack>;
}

const TRANSFORM_DURATION = '0.7s';
const OPACITY_DURATION = '0.4s';

const getContentFadeStyles = (isLoading: boolean): StackProps => {
  return {
    transition: `transform ${TRANSFORM_DURATION}, opacity ${OPACITY_DURATION}`,
    opacity: isLoading ? 0 : 1,
    transform: isLoading ? 'translateX(-100%)' : 'translateX(0)',
  };
};

const getLoadingFadeStyles = (isLoading: boolean): StackProps => {
  return {
    position: { base: 'fixed', lg: 'absolute' },
    top: '50%',
    left: '50%',
    visibility: isLoading ? 'visible' : 'hidden',
    opacity: isLoading ? 1 : 0,
    transform: 'translate(-50%, -50%)',
    transition: `opacity ${OPACITY_DURATION}`,
  };
};
