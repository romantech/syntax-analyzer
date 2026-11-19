import { NumberInput } from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';

import {
  MAX_PICKER_SENTENCE,
  MIN_PICKER_SENTENCE,
  type RandomSentenceFormValues,
} from '@/features/syntax-analyzer';

export default function SentenceCountPicker() {
  const { control } = useFormContext<RandomSentenceFormValues>();

  return (
    <Controller
      name="sent_count"
      control={control}
      render={({ field }) => (
        <NumberInput.Root
          name={field.name}
          value={Number.isNaN(field.value) ? '' : String(field.value)}
          onValueChange={({ value, valueAsNumber }) =>
            field.onChange(value === '' ? NaN : valueAsNumber)
          }
          w="full"
          maxW={66}
          min={MIN_PICKER_SENTENCE}
          max={MAX_PICKER_SENTENCE}
        >
          <NumberInput.Input
            ref={field.ref}
            onBlur={field.onBlur}
            aria-label="Sentence count picker"
            h={{ base: '2.75rem', lg: 12 }}
            css={{ '--focus-color': 'colors.teal.300' }}
          />
          <NumberInput.Control>
            <NumberInput.IncrementTrigger aria-label="문장 수 늘리기" />
            <NumberInput.DecrementTrigger aria-label="문장 수 줄이기" />
          </NumberInput.Control>
        </NumberInput.Root>
      )}
    />
  );
}
