import { Button, Field, HStack, Input, InputGroup, type StackProps } from '@chakra-ui/react';
import type { SubmitEventHandler } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CiShoppingTag } from 'react-icons/ci';
import { ValidationError } from 'yup';
import {
  addTopicSchema,
  MAX_TOPIC_LENGTH,
  type RandomSentenceFormValues,
  SENTENCE_CONTROL_HEIGHT,
} from '@/features/syntax-analyzer';
import { translateValidationMessage } from '@/features/syntax-analyzer/schemes/validation-messages';

export default function AddTopicForm(stackProps: StackProps) {
  const { t } = useTranslation();
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
          startElementProps={{ boxSize: SENTENCE_CONTROL_HEIGHT, p: 0, color: 'fg' }}
        >
          <Input
            {...keywordField}
            onChange={async (event) => {
              await keywordField.onChange(event);
              if (errors.keyword) clearErrors('keyword');
            }}
            h={SENTENCE_CONTROL_HEIGHT}
            ps={SENTENCE_CONTROL_HEIGHT}
            maxLength={MAX_TOPIC_LENGTH}
            aria-label={t('generator.keyword')}
            placeholder={t('generator.keyword')}
            enterKeyHint="done"
          />
        </InputGroup>
        <Field.ErrorText aria-live="polite">
          {errors.keyword?.message && translateValidationMessage(t, errors.keyword.message)}
        </Field.ErrorText>
      </Field.Root>
      <Button flexShrink={0} h={SENTENCE_CONTROL_HEIGHT} fontSize="md" type="submit">
        {t('generator.addTopic')}
      </Button>
    </HStack>
  );
}
