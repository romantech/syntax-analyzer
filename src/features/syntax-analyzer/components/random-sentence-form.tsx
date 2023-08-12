import {
  Button,
  Center,
  Divider,
  Heading,
  Highlight,
  HStack,
  Input,
  ListItem,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  StackDivider,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  UnorderedList,
  VStack,
  Wrap,
} from '@chakra-ui/react';
import { RiAiGenerate } from 'react-icons/ri';

export default function RandomSentenceForm() {
  return (
    <Stack w="full" maxW={690} gap={5}>
      <Heading size="lg" textTransform="uppercase" pb={1}>
        랜덤 문장 생성
      </Heading>
      <UnorderedList>
        <ListItem>입력한 키워드와 관련된 랜덤 문장을 생성할 수 있어요</ListItem>
        <ListItem>1회 최대 5개의 랜덤 문장을 생성할 수 있어요</ListItem>
        <ListItem>토픽은 3개까지 추가할 수 있어요</ListItem>
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
          <NumberInput maxW={70} min={1} max={5} defaultValue={5}>
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
      <Wrap mt={-2} maxW="630px">
        {['apple', 'keyboard', 'macbook'].map((label, i) => (
          <Tag
            size="sm"
            key={i}
            borderRadius="md"
            variant="solid"
            colorScheme="teal"
          >
            <TagLabel w="fit" textTransform="capitalize">
              {label}
            </TagLabel>
            <TagCloseButton />
          </Tag>
        ))}
      </Wrap>

      <VStack
        align="stretch"
        maxH="190px"
        overflowY="auto"
        divider={<StackDivider borderColor="gray.700" />}
      >
        <Text as="i" cursor="pointer">
          <Highlight
            query={['spotlight', 'emphasize', 'Accentuate']}
            styles={{ color: 'teal.300', fontWeight: 'bold' }}
          >
            With the Highlight component, you can spotlight, emphasize and
            accentuate words.
          </Highlight>
        </Text>

        <Text as="i" cursor="pointer">
          <Highlight
            query={['library', 'exam']}
            styles={{ color: 'teal.300', fontWeight: 'bold' }}
          >
            Tom and Jerry are studying at the library for their final exam.
          </Highlight>
        </Text>
      </VStack>
    </Stack>
  );
}
