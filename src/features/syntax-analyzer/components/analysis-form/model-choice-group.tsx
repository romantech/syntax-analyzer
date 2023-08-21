import {
  Badge,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import { AnalysisFormValues } from '@/features/syntax-analyzer';
import { Control, Controller } from 'react-hook-form';

const MODEL_FIELDS = [
  {
    value: 'gpt-4',
    label: 'gpt-4',
    desc: '분석 속도는 느리지만 정확도는 높아요',
    count: 3,
    recommend: true,
  },
  {
    value: 'gpt-3.5-turbo',
    label: 'gpt-3.5',
    desc: '분석 속도는 빠르지만 정확도는 낮아요',
    count: 1,
    recommend: false,
  },
];

interface ModelChoiceGroupProps {
  control: Control<AnalysisFormValues>;
  remainingCount: number;
}

export default function ModelChoiceGroup({
  control,
  remainingCount,
}: ModelChoiceGroupProps) {
  return (
    <Controller
      name="model"
      control={control}
      render={({ field: { onChange, value } }) => (
        <RadioGroup
          onChange={onChange}
          value={value}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          {MODEL_FIELDS.map((field) => (
            <Stack key={field.value}>
              <HStack align="center">
                <Radio
                  colorScheme="teal"
                  value={field.value}
                  isDisabled={remainingCount < field.count}
                >
                  <Text as="span" textTransform="uppercase">
                    {field.label}
                  </Text>
                </Radio>
                <Badge
                  fontSize={10}
                  variant="outline"
                  colorScheme="orange"
                  hidden={!field.recommend}
                >
                  recommended
                </Badge>
              </HStack>
              <Text ml={6} fontSize={14} color="description" mt={-1}>
                {field.desc}
              </Text>
            </Stack>
          ))}
        </RadioGroup>
      )}
    />
  );
}
