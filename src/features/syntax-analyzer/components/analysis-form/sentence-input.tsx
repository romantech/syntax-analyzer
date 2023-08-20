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
import { MAX_SENTENCE_LENGTH } from '@/features/syntax-analyzer/constants';
import { HELPER_MESSAGES } from '@/features/syntax-analyzer/schemes';

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
            placeholder={`${MAX_SENTENCE_LENGTH}자 미만의 영어 문장을 입력해 주세요`}
            maxLength={MAX_SENTENCE_LENGTH}
            variant="filled"
            focusBorderColor="teal.300"
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
    text: HELPER_MESSAGES.ENGLISH_OR_SYMBOL,
  },
  {
    icon: TbArrowAutofitWidth,
    text: HELPER_MESSAGES.MAX_LENGTH,
  },
  {
    icon: PiNotePencil,
    text: HELPER_MESSAGES.MIN_WORDS,
  },
];

export default SentenceInput;
