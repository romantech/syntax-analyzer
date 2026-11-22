import { Heading, Stack, type StackProps, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import ScrollDownButton from './scroll-down-button';

interface TitleSectionProps extends StackProps {
  onScrollDown?: () => void;
}

export default function HeroShowcase({ onScrollDown, ...stackProps }: TitleSectionProps) {
  const { t } = useTranslation();
  return (
    <Stack justify="center" scrollSnapAlign="start" {...stackProps}>
      <Stack>
        <Heading
          as="p"
          fontSize={{ base: 'xl', lg: '3xl' }}
          lineHeight={1.2}
          textStyle="showcaseGradient"
          css={{
            '--showcase-stop': '60%',
            _light: { w: 'fit-content', '--showcase-stop': '90%' },
          }}
        >
          {t('home.heroLead')}
        </Heading>
        <Heading
          as="h1"
          lang="en"
          fontFamily="brand"
          fontSize={{ base: '4xl', sm: '5xl', md: '6xl', lg: '7xl' }}
          lineHeight={{ base: 1.2, sm: 1 }}
          textTransform="uppercase"
          whiteSpace="pre-line"
          fontWeight="extrabold"
        >
          {'Syntax\nAnalyzer'}
        </Heading>
      </Stack>
      <Text
        maxW="3xl"
        fontWeight={500}
        fontSize={{ base: '1.0625rem', lg: 'xl' }}
        lineHeight={{ base: '1.6875rem', lg: 'base' }}
      >
        {t('home.heroDescription')}
      </Text>
      <ScrollDownButton onClick={onScrollDown} hidden={!onScrollDown} />
    </Stack>
  );
}
