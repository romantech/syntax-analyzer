import { Text } from '@chakra-ui/react';
import { isPunctuation } from '@/utils/common.ts';

interface TokenProps {
  token: string;
  padding: number[];
}

const Token = ({ token, padding }: TokenProps) => {
  return (
    <Text position="relative" as="span" p={padding} zIndex={1}>
      {token}
    </Text>
  );
};

interface TokensProps {
  sentence: string[];
}

export default function Tokens({ sentence }: TokensProps) {
  return sentence.map((token, i) => {
    const isNextTokenPunctuation = isPunctuation(sentence[i + 1]);
    const isCurrentTokenPunctuation = isPunctuation(token);
    const spaceAfter = isNextTokenPunctuation ? 0 : 1;
    const spaceBefore = isCurrentTokenPunctuation ? 0 : 1;
    return (
      <Token token={token} key={i} padding={[0, spaceAfter, 0, spaceBefore]} />
    );
  });
}
