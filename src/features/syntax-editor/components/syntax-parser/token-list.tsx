import { isPunctuation } from '@/base';
import { Token } from '@/features/syntax-editor';

interface TokensProps {
  sentence: string[];
}

export default function TokenList({ sentence }: TokensProps) {
  const tokenCount = new Map<string, number>();

  return sentence.map((token, i) => {
    const isNextTokenPunctuation = isPunctuation(sentence[i + 1]);
    const isCurrentTokenPunctuation = isPunctuation(token);
    const occurrence = tokenCount.get(token) ?? 0;
    const tokenKey = `${token}-${occurrence}`;

    tokenCount.set(token, occurrence + 1);

    const spaceAfter = isNextTokenPunctuation ? 0 : '3px';
    const spaceBefore = isCurrentTokenPunctuation ? 0 : '3px';

    return (
      <Token
        token={token}
        key={tokenKey}
        paddingRight={spaceAfter}
        paddingLeft={spaceBefore}
        index={i}
      />
    );
  });
}
