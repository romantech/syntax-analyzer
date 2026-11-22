import { Spinner, type SpinnerProps } from '@chakra-ui/react';

export default function ThemedSpinner(spinnerProps: SpinnerProps) {
  return (
    <Spinner
      borderWidth="5px"
      animationDuration="0.65s"
      css={{ '--spinner-track-color': 'colors.border' }}
      color="teal.fg"
      size="xl"
      {...spinnerProps}
    />
  );
}
