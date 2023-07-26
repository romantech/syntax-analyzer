import { Card, CardBody, HStack, Icon, Text } from '@chakra-ui/react';
import { FaMagnifyingGlass } from 'react-icons/fa6';

export default function TagNotice() {
  return (
    <Card variant="filled">
      <CardBody>
        <HStack>
          <Icon as={FaMagnifyingGlass} />
          <Text>태그를 선택한 후 문장을 드래그해주세요</Text>
        </HStack>
      </CardBody>
    </Card>
  );
}
