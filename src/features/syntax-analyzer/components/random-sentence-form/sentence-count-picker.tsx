import { Controller, useFormContext } from 'react-hook-form';
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import {
  MAX_PICKER_SENTENCE,
  MIN_PICKER_SENTENCE,
} from '@/features/syntax-analyzer';

export default function SentenceCountPicker() {
  const { control } = useFormContext();

  return (
    <Controller
      name="sent_count"
      control={control}
      render={({ field }) => (
        <NumberInput
          {...field}
          focusBorderColor="teal.300"
          maxW={70}
          min={MIN_PICKER_SENTENCE}
          max={MAX_PICKER_SENTENCE}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      )}
    />
  );
}
