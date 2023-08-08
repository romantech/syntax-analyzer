import {
  Card,
  CardBody,
  CardProps,
  HStack,
  Icon,
  Text,
} from '@chakra-ui/react';
import { FaMagnifyingGlass } from 'react-icons/fa6';

interface NoticeProps extends CardProps {
  text: string;
}

export default function Notice({ text, ...cardProps }: NoticeProps) {
  return (
    <Card variant="filled" w="full" {...cardProps}>
      <CardBody>
        <HStack>
          <Icon as={FaMagnifyingGlass} />
          <Text>{text}</Text>
        </HStack>
      </CardBody>
    </Card>
  );
}
