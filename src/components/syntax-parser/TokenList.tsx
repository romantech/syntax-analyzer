import { isPunctuation } from '@/utils/common.ts';
import { Token } from '@/components/syntax-parser';

interface TokensProps {
  sentence: string[];
}

export default function TokenList({ sentence }: TokensProps) {
  return sentence.map((token, i) => {
    const isNextTokenPunctuation = isPunctuation(sentence[i + 1]);
    const isCurrentTokenPunctuation = isPunctuation(token);
    const spaceAfter = isNextTokenPunctuation ? 0 : 1;
    const spaceBefore = isCurrentTokenPunctuation ? 0 : 1;
    return (
      <Token
        token={token}
        key={i}
        padding={[0, spaceAfter, 0, spaceBefore]}
        index={i}
      />
    );
  });
}
