import { Badge, HStack, RadioGroup, Stack, Text } from '@chakra-ui/react';
import { type Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ANALYSIS_DECREMENT_COUNT,
  AnalysisModel,
} from '@/features/syntax-analyzer/constants/settings';
import type { AnalysisFormValues } from '@/features/syntax-analyzer/hooks/use-analysis-form';

interface ModelChoiceGroupProps {
  control: Control<AnalysisFormValues>;
  remainingCount: number;
}

export default function ModelChoiceGroup({ control, remainingCount }: ModelChoiceGroupProps) {
  const { t } = useTranslation();
  const modelFields = [
    {
      value: AnalysisModel.FAST_FT,
      label: t('analyzer.basicModel'),
      desc: t('analyzer.basicModelDescription'),
      count: ANALYSIS_DECREMENT_COUNT[AnalysisModel.FAST_FT],
      recommend: true,
    },
    {
      value: AnalysisModel.PRIMARY,
      label: t('analyzer.advancedModel'),
      desc: t('analyzer.advancedModelDescription'),
      count: ANALYSIS_DECREMENT_COUNT[AnalysisModel.PRIMARY],
      recommend: false,
    },
  ];
  return (
    <Controller
      name="model"
      control={control}
      render={({ field: { name, onBlur, onChange, ref, value } }) => (
        <RadioGroup.Root
          aria-label={t('analyzer.chooseModel')}
          name={name}
          onValueChange={({ value }) => onChange(value)}
          value={value}
          display="flex"
          flexDirection="column"
          alignItems="start"
          gap={2}
        >
          {modelFields.map((field) => (
            <Stack key={field.value} gap={1} align="start">
              <HStack>
                <RadioGroup.Item
                  colorPalette="teal"
                  value={field.value}
                  disabled={remainingCount < field.count}
                >
                  <RadioGroup.ItemHiddenInput
                    aria-describedby={`model-description-${field.value}`}
                    onBlur={onBlur}
                    ref={value === field.value ? ref : undefined}
                  />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>{field.label}</RadioGroup.ItemText>
                </RadioGroup.Item>
                <Badge
                  fontWeight="semibold"
                  variant="subtle"
                  colorPalette="teal"
                  _light={{ color: 'teal.700' }}
                  hidden={!field.recommend}
                >
                  {t('analyzer.recommended')}
                </Badge>
              </HStack>
              <Text id={`model-description-${field.value}`} ml={6} fontSize={14} color="fg.muted">
                {field.desc}
              </Text>
            </Stack>
          ))}
        </RadioGroup.Root>
      )}
    />
  );
}
