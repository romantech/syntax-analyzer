import { Badge, HStack, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import { type Control, Controller } from 'react-hook-form';
import {
  ANALYSIS_DECREMENT_COUNT,
  AnalysisModel,
} from '@/features/syntax-analyzer/constants/settings';
import type { AnalysisFormValues } from '@/features/syntax-analyzer/hooks/use-analysis-form';

const MODEL_FIELDS = [
  {
    value: AnalysisModel.FAST_FT,
    label: '기본 모델',
    desc: '대부분의 문장을 잘 분석해요',
    count: ANALYSIS_DECREMENT_COUNT[AnalysisModel.FAST_FT],
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

export default function ModelChoiceGroup({ control, remainingCount }: ModelChoiceGroupProps) {
  return (
    <Controller
      name="model"
      control={control}
      render={({ field: { onChange, value } }) => (
        <RadioGroup
          aria-label="AI 모델 선택"
          onChange={onChange}
          value={value}
          display="flex"
          flexDirection="column"
          alignItems="start"
          gap={2}
          sx={{ '.chakra-radio__control': { mt: 1 } }}
        >
          {MODEL_FIELDS.map((field) => (
            <Radio
              key={field.value}
              colorScheme="teal"
              value={field.value}
              isDisabled={remainingCount < field.count}
              alignItems="start"
            >
              <Stack as="span" gap={1}>
                <HStack as="span">
                  <Text as="span">{field.label}</Text>
                  <Badge
                    fontSize="xs"
                    fontWeight="semibold"
                    variant="outline"
                    colorScheme="yellow"
                    color="yellow.700"
                    _dark={{ color: 'yellow.300' }}
                    hidden={!field.recommend}
                  >
                    recommended
                  </Badge>
                </HStack>
                <Text as="span" fontSize={14} color="description">
                  {field.desc}
                </Text>
              </Stack>
            </Radio>
          ))}
        </RadioGroup>
      )}
    />
  );
}
