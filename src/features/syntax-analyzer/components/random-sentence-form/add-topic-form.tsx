import { Button, Field, HStack, Input, InputGroup, type StackProps } from '@chakra-ui/react';
import { type SubmitHandler, useFormContext } from 'react-hook-form';
import { CiShoppingTag } from 'react-icons/ci';
import type { ValidationError } from 'yup';

import {
  addTopicSchema,
  MAX_TOPIC_LENGTH,
  type RandomSentenceFormValues,
} from '@/features/syntax-analyzer';

export default function AddTopicForm(stackProps: StackProps) {
  const { register, clearErrors, handleSubmit, setValue, resetField, setError, formState } =
    useFormContext<RandomSentenceFormValues>();
  const keywordField = register('keyword');

  const onAddTopic: SubmitHandler<RandomSentenceFormValues> = (data) => {
    const { keyword, topics } = data;

    addTopicSchema
      .validate({ keyword, topics: [...topics, keyword] })
      .then(() => {
        setValue('topics', [...topics, keyword]);
        resetField('keyword');
      })
      .catch((err: ValidationError) => {
        setError('keyword', { type: 'manual', message: err.errors[0] });
      });
  };

  const { errors } = formState;

  return (
    <HStack as="form" align="start" onSubmit={handleSubmit(onAddTopic)} {...stackProps}>
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
            variant="subtle"
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
      <Button
        flexShrink={0}
        h={{ base: '2.75rem', lg: 12 }}
        fontSize="md"
        variant="outline"
        type="submit"
      >
        토픽 등록
      </Button>
    </HStack>
  );
}
