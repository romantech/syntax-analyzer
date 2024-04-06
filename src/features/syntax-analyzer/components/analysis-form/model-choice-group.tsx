import {
  Badge,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Control, Controller } from 'react-hook-form';

import {
  AnalysisFormValues,
  AnalysisModel,
  GPT_3_5_DECREMENT_COUNT,
  GPT_4_DECREMENT_COUNT,
} from '@/features/syntax-analyzer';

const MODEL_FIELDS = [
  {
    value: AnalysisModel.GPT_3_5_FT,
    label: 'GPT-3.5 (Fine-Tuned)',
    desc: '정확도는 GPT 4와 비슷하거나 다소 낮지만 속도가 빨라요',
    count: GPT_3_5_DECREMENT_COUNT,
    recommend: true,
  },
  {
    value: AnalysisModel.GPT_4,
    label: 'GPT-4',
    desc: '정확도는 높지만 속도가 느려요',
    count: GPT_4_DECREMENT_COUNT,
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
                  <Text as="span">{field.label}</Text>
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
