import { isPunctuation } from '@/base';
import { Token } from '@/features/syntax-editor';

interface TokensProps {
  sentence: string[];
}

export default function TokenList({ sentence }: TokensProps) {
  return sentence.map((token, i) => {
    const isNextTokenPunctuation = isPunctuation(sentence[i + 1]);
    const isCurrentTokenPunctuation = isPunctuation(token);
    const spaceAfter = isNextTokenPunctuation ? 0 : '3px';
    const spaceBefore = isCurrentTokenPunctuation ? 0 : '3px';
    return (
      <Token
        token={token}
        key={i}
        paddingRight={spaceAfter}
        paddingLeft={spaceBefore}
        index={i}
      />
    );
  });
}
