import { Spinner, type SpinnerProps } from '@chakra-ui/react';

export default function ThemedSpinner(spinnerProps: SpinnerProps) {
  return (
    <Spinner
      borderWidth="5px"
      animationDuration="0.65s"
      css={{ '--spinner-track-color': 'colors.gray.200' }}
      color="teal.300"
      size="xl"
      {...spinnerProps}
    />
  );
}
