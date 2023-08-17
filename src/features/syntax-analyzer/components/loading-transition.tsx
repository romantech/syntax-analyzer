import { PropsWithChildren } from 'react';
import { Stack, StackProps } from '@chakra-ui/react';

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
  const getStyleFunc =
    type === 'content' ? getContentFadeStyles : getLoadingFadeStyles;

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
    position: 'absolute',
    top: '45%',
    left: '45%',
    opacity: isLoading ? 1 : 0,
    transition: `transform ${TRANSFORM_DURATION}, opacity ${OPACITY_DURATION}`,
    transform: `translate(-50%, -50%) ${
      isLoading ? 'translateX(0)' : 'translateX(100%)'
    }`,
  };
};
