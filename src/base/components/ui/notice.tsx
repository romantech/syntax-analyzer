import { Card, type CardRootProps, HStack, Icon, Text } from '@chakra-ui/react';
import { FaCircleInfo } from 'react-icons/fa6';

interface NoticeProps extends CardRootProps {
  text: string;
}

export default function Notice({ text, ...cardProps }: NoticeProps) {
  return (
    <Card.Root variant="subtle" w="full" bg="bg.emphasized" {...cardProps}>
      <Card.Body px={4} py={3}>
        <HStack align="start" gap={2.5}>
          <Icon as={FaCircleInfo} boxSize={4} mt={1} flexShrink={0} aria-hidden />
          <Text fontSize="sm" lineHeight="tall">
            {text}
          </Text>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
}
