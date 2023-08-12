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

interface SentenceInputProps extends InputProps {
  errorMessage?: string;
  helperMessage?: string;
}

const SentenceInput = forwardRef<HTMLInputElement, SentenceInputProps>(
  function SentenceInput({ errorMessage, size = 'lg', ...inputProps }, ref) {
    const [parent] = useAutoAnimate({ duration: 180 });
    return (
      <Box flexGrow={1} ref={parent}>
        <InputGroup size={size}>
          <InputLeftElement pointerEvents="none">
            <PiTextTBold />
          </InputLeftElement>
          <Input
            placeholder="영어 문장을 입력해 주세요"
            maxLength={90}
            variant="filled"
            {...inputProps}
            ref={ref}
          />
        </InputGroup>
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
        <FormHelperText color="gray.500" pt={1}>
          <List spacing={1.5}>
            <ListItem>
              <ListIcon as={BsMagic} />
              {`축약 표현은 자동으로 풀어져요 (I'll → I will)`}
            </ListItem>
            <ListItem>
              <ListIcon as={RiEnglishInput} />
              영어와 문장 부호만 입력할 수 있어요
            </ListItem>
            <ListItem>
              <ListIcon as={TbArrowAutofitWidth} />
              최대 90자까지만 입력할 수 있어요
            </ListItem>
            <ListItem>
              <ListIcon as={PiNotePencil} />
              최소 3 단어로 이루어진 문장을 입력해 주세요
            </ListItem>
          </List>
        </FormHelperText>
      </Box>
    );
  },
);

export default SentenceInput;
