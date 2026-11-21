import { Button, Field, HStack, Input, InputGroup, type StackProps } from '@chakra-ui/react';
import type { SubmitEventHandler } from 'react';
import { useFormContext } from 'react-hook-form';
import { CiShoppingTag } from 'react-icons/ci';
import { ValidationError } from 'yup';

import {
  addTopicSchema,
  MAX_TOPIC_LENGTH,
  type RandomSentenceFormValues,
} from '@/features/syntax-analyzer';

export default function AddTopicForm(stackProps: StackProps) {
  const { register, clearErrors, getValues, setValue, resetField, setError, formState } =
    useFormContext<RandomSentenceFormValues>();
  const keywordField = register('keyword');

  const onAddTopic: SubmitEventHandler = (event) => {
    event.preventDefault();
    const [keyword, topics] = getValues(['keyword', 'topics']);

    try {
      const { topics: nextTopics } = addTopicSchema.validateSync(
        { keyword, topics: [...topics, keyword] },
        { abortEarly: false },
      );
      setValue('topics', nextTopics);
      resetField('keyword');
    } catch (error) {
      if (!(error instanceof ValidationError)) throw error;
      setError('keyword', { type: 'manual', message: error.errors[0] });
    }
  };

  const { errors } = formState;

  return (
    <HStack as="form" align="start" onSubmit={onAddTopic} {...stackProps}>
      <Field.Root minW={0} invalid={!!errors.keyword}>
        <InputGroup
          startElement={<CiShoppingTag size={20} />}
          startElementProps={{ boxSize: { base: '2.75rem', lg: 12 }, p: 0, color: 'fg' }}
        >
          <Input
            {...keywordField}
            onChange={async (event) => {
              await keywordField.onChange(event);
              if (errors.keyword) clearErrors('keyword');
            }}
            h={{ base: '2.75rem', lg: 12 }}
            ps={{ base: '2.75rem', lg: 12 }}
            maxLength={MAX_TOPIC_LENGTH}
            aria-label="영문 키워드"
            placeholder="영문 키워드"
            enterKeyHint="done"
          />
        </InputGroup>
        <Field.ErrorText aria-live="polite">{errors.keyword?.message}</Field.ErrorText>
      </Field.Root>
      <Button flexShrink={0} h={{ base: '2.75rem', lg: 12 }} fontSize="md" type="submit">
        토픽 등록
      </Button>
    </HStack>
  );
}
