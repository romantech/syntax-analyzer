import {
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Input,
  ListItem,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { RiAiGenerate } from 'react-icons/ri';

export default function RandomSentenceForm() {
  return (
    <Stack gap={4}>
      <Heading size="lg" textTransform="uppercase" pb={2}>
        랜덤 문장 생성
      </Heading>
      <UnorderedList>
        <ListItem>입력한 키워드와 관련된 랜덤 문장을 생성할 수 있어요</ListItem>
        <ListItem>1회 최대 10개의 랜덤 문장을 생성할 수 있어요</ListItem>
        <ListItem>토픽은 5개까지 추가할 수 있어요</ListItem>
      </UnorderedList>

      <HStack>
        <HStack>
          <Input
            variant="filled"
            maxLength={20}
            placeholder="영문 토픽을 입력 해주세요"
          />
          <Button w={120} variant="outline">
            토픽 추가
          </Button>
        </HStack>
        <Center h="38px" px={3}>
          <Divider orientation="vertical" />
        </Center>
        <HStack>
          <Text as="b" fontSize={14} whiteSpace="pre">{`생성\n개수`}</Text>
          <NumberInput maxW={70} min={1} max={10} defaultValue={5}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Button leftIcon={<RiAiGenerate />} textTransform="uppercase">
            generate
          </Button>
        </HStack>
      </HStack>
      <HStack spacing={2} flexWrap="wrap" hidden>
        {['md', 'md', 'md', 'md', 'md'].map((size, i) => (
          <Tag size={size} key={i} borderRadius="full" variant="solid">
            <TagLabel textTransform="capitalize">green</TagLabel>
            <TagCloseButton />
          </Tag>
        ))}
      </HStack>
    </Stack>
  );
}
