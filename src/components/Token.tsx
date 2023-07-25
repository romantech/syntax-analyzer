import { NonWordCharPattern } from '@/constants/regex';
import { Text } from '@chakra-ui/react';
import { Fragment } from 'react';

interface TokenProps {
  token: string;
  index: number;
  isFirst: boolean;
}

export default function Token({ token, index, isFirst }: TokenProps) {
  const isPunctuation = token.match(NonWordCharPattern);
  return (
    <Fragment>
      {isPunctuation || isFirst ? '' : ' '}
      <Text as="span">{token}</Text>
    </Fragment>
  );
}
