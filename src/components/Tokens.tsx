import { Text } from '@chakra-ui/react';
import { isPunctuation } from '@/utils/common.ts';

interface TokenProps {
  token: string;
  space: boolean;
  isPunctuation: boolean;
}

const Token = ({ token, space, isPunctuation }: TokenProps) => {
  const paddingRight = space ? 1 : 0;
  const paddingLeft = !isPunctuation ? 1 : 0;
  return (
    <Text as="span" pr={paddingRight} pl={paddingLeft}>
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
    return (
      <Token
        token={token}
        key={i}
        space={!isNextTokenPunctuation}
        isPunctuation={Boolean(isCurrentTokenPunctuation)}
      />
    );
  });
}
