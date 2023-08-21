import { Spinner, SpinnerProps } from '@chakra-ui/react';

export default function ThemedSpinner(spinnerProps: SpinnerProps) {
  return (
    <Spinner
      thickness="5px"
      speed="0.65s"
      emptyColor="gray.200"
      color="teal.300"
      size="xl"
      {...spinnerProps}
    />
  );
}
