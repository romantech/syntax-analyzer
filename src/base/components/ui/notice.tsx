import { Card, CardBody, type CardProps, HStack, Icon, Text } from '@chakra-ui/react';
import { FaCircleInfo } from 'react-icons/fa6';

interface NoticeProps extends CardProps {
  text: string;
}

export default function Notice({ text, ...cardProps }: NoticeProps) {
  return (
    <Card variant="filled" w="full" {...cardProps}>
      <CardBody px={4} py={3}>
        <HStack align="start" gap={2.5}>
          <Icon as={FaCircleInfo} boxSize={4} mt={1} flexShrink={0} aria-hidden />
          <Text fontSize="sm" lineHeight="tall">
            {text}
          </Text>
        </HStack>
      </CardBody>
    </Card>
  );
}
