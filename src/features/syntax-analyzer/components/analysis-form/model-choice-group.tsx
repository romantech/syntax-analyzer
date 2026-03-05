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
  ANALYSIS_DECREMENT_COUNT,
  AnalysisFormValues,
  AnalysisModel,
} from '@/features/syntax-analyzer';

const MODEL_FIELDS = [
  {
    value: AnalysisModel.FAST,
    label: '기본 모델',
    desc: '대부분의 문장을 잘 분석해요',
    count: ANALYSIS_DECREMENT_COUNT[AnalysisModel.FAST],
    recommend: true,
  },
  {
    value: AnalysisModel.PRIMARY,
    label: '고급 모델',
    desc: '정확도가 조금 더 높아요',
    count: ANALYSIS_DECREMENT_COUNT[AnalysisModel.PRIMARY],
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
