import { NumberInput } from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';

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
            ps={4}
            pe={8}
            borderRadius="md"
            fontSize="md"
            lineHeight="base"
          />
          <NumberInput.Control top={0} bottom="auto" h="calc(100% - 2px)">
            <NumberInput.IncrementTrigger aria-label="문장 수 늘리기" color="currentColor">
              <FaCaretUp />
            </NumberInput.IncrementTrigger>
            <NumberInput.DecrementTrigger aria-label="문장 수 줄리기" color="currentColor">
              <FaCaretDown />
            </NumberInput.DecrementTrigger>
          </NumberInput.Control>
        </NumberInput.Root>
      )}
    />
  );
}
