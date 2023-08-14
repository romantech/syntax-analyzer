import {
  Box,
  FormErrorMessage,
  FormHelperText,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  List,
  ListIcon,
  ListItem,
} from '@chakra-ui/react';
import { PiNotePencil, PiTextTBold } from 'react-icons/pi';
import { forwardRef } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { RiEnglishInput } from 'react-icons/ri';
import { BsMagic } from 'react-icons/bs';
import { TbArrowAutofitWidth } from 'react-icons/tb';
import {
  MAX_SENTENCE_LENGTH,
  MIN_SENTENCE_WORDS,
} from '@/features/syntax-editor';

interface SentenceInputProps extends InputProps {
  errorMessage?: string;
  helperMessage?: string;
  showHelperText?: boolean;
}

const SentenceInput = forwardRef<HTMLInputElement, SentenceInputProps>(
  function SentenceInput(
    { errorMessage, size = 'lg', showHelperText = false, ...inputProps },
    ref,
  ) {
    const [parent] = useAutoAnimate({ duration: 180 });
    return (
      <Box flexGrow={1} ref={parent}>
        <InputGroup size={size}>
          <InputLeftElement pointerEvents="none">
            <PiTextTBold />
          </InputLeftElement>
          <Input
            placeholder="영어 문장을 입력해 주세요"
            maxLength={MAX_SENTENCE_LENGTH}
            variant="filled"
            focusBorderColor="teal.400"
            {...inputProps}
            ref={ref}
          />
        </InputGroup>
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
        <FormHelperText color="gray.500" pt={1} hidden={!showHelperText}>
          <List spacing={1.5}>
            {HELPER_TEXTS.map(({ icon, text }, i) => (
              <ListItem key={i}>
                <ListIcon as={icon} />
                {text}
              </ListItem>
            ))}
          </List>
        </FormHelperText>
      </Box>
    );
  },
);

const HELPER_TEXTS = [
  {
    icon: BsMagic,
    text: `축약 표현은 자동으로 풀어져요 (I'll → I will)`,
  },
  {
    icon: RiEnglishInput,
    text: '영어와 문장 부호만 입력할 수 있어요',
  },
  {
    icon: TbArrowAutofitWidth,
    text: `최대 ${MAX_SENTENCE_LENGTH}자까지만 입력할 수 있어요`,
  },
  {
    icon: PiNotePencil,
    text: `최소 ${MIN_SENTENCE_WORDS} 단어로 이루어진 문장을 입력해 주세요`,
  },
];

export default SentenceInput;
