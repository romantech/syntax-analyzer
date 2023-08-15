import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  StackProps,
} from '@chakra-ui/react';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import {
  addTopicSchema,
  RandomSentenceFormValues,
} from '@/features/syntax-analyzer';
import { useRef } from 'react';
import { ValidationError } from 'yup';
import { CiShoppingTag } from 'react-icons/ci';

export default function AddTopicForm(stackProps: StackProps) {
  const {
    register,
    clearErrors,
    handleSubmit,
    setValue,
    resetField,
    setError,
    formState,
  } = useFormContext<RandomSentenceFormValues>();
  /**
   * By default, Popover focus is to sent to PopoverContent when it opens.
   * Pass the keywordInputRef prop to send focus to a specific element instead.
   * @see https://react-hook-form.com/faqs
   * @see https://chakra-ui.com/docs/components/popover/usage
   * */
  const keywordInputRef = useRef<HTMLInputElement | null>(null);
  const { ref: registerRef, onChange, ...registerRest } = register('keyword');

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
    <HStack as="form" onSubmit={handleSubmit(onAddTopic)} {...stackProps}>
      <Popover
        isOpen={!!errors.keyword}
        placement="top"
        initialFocusRef={keywordInputRef}
      >
        <PopoverAnchor>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <CiShoppingTag fontSize={18} />
            </InputLeftElement>
            <Input
              {...registerRest}
              onChange={async (v) => {
                await onChange(v);
                if (errors.keyword) clearErrors('keyword');
              }}
              variant="filled"
              ref={(element) => {
                // Popover 표시될 때 focus 유지하기 위해 ref share
                registerRef(element);
                keywordInputRef.current = element;
              }}
              maxLength={20}
              focusBorderColor="teal.400"
              placeholder="영문 키워드를 입력 해주세요"
              onBlur={() => clearErrors('keyword')}
            />
          </InputGroup>
        </PopoverAnchor>
        <PopoverContent w="fit-content">
          <PopoverArrow />
          <PopoverBody>{errors.keyword?.message}</PopoverBody>
        </PopoverContent>
      </Popover>
      <Button minW="fit-content" variant="outline" type="submit">
        추가
      </Button>
    </HStack>
  );
}
