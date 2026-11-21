import { Group, IconButton, NumberInput } from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';
import { FiMinus, FiPlus } from 'react-icons/fi';

import {
  MAX_PICKER_SENTENCE,
  MIN_PICKER_SENTENCE,
  type RandomSentenceFormValues,
  SENTENCE_CONTROL_HEIGHT,
} from '@/features/syntax-analyzer';

export default function SentenceCountPicker() {
  const { control } = useFormContext<RandomSentenceFormValues>();

  return (
    <Controller
      name="sent_count"
      control={control}
      render={({ field }) => (
        <NumberInput.Root
          asChild
          name={field.name}
          value={Number.isNaN(field.value) ? '' : String(field.value)}
          onValueChange={({ value, valueAsNumber }) =>
            field.onChange(value === '' ? NaN : valueAsNumber)
          }
          min={MIN_PICKER_SENTENCE}
          max={MAX_PICKER_SENTENCE}
        >
          <Group attached flexShrink={0} h={SENTENCE_CONTROL_HEIGHT}>
            <NumberInput.DecrementTrigger asChild>
              <IconButton
                aria-label="문장 수 줄리기"
                variant="outline"
                size="sm"
                h="full"
                borderColor="border"
              >
                <FiMinus />
              </IconButton>
            </NumberInput.DecrementTrigger>
            <NumberInput.Input
              ref={field.ref}
              onBlur={field.onBlur}
              aria-label="Sentence count picker"
              w={10}
              h="full"
              px={0}
              textAlign="center"
              lineHeight="base"
            />
            <NumberInput.IncrementTrigger asChild>
              <IconButton
                aria-label="문장 수 늘리기"
                variant="outline"
                size="sm"
                h="full"
                borderColor="border"
                borderTopEndRadius="md"
              >
                <FiPlus />
              </IconButton>
            </NumberInput.IncrementTrigger>
          </Group>
        </NumberInput.Root>
      )}
    />
  );
}
