import { IconButton, Menu, Portal } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuCheck, LuLanguages } from 'react-icons/lu';

import { changeLanguage, getActiveLanguage } from '@/i18n';
import { LANGUAGES } from '@/i18n/languages';

export function LanguageMenu() {
  const { t, i18n } = useTranslation();
  const language = getActiveLanguage(i18n);
  const label = t('nav.language', { language: LANGUAGES[language] });

  return (
    <Menu.Root positioning={{ placement: 'bottom-end' }} lazyMount>
      <Menu.Trigger asChild>
        <IconButton
          aria-label={label}
          title={label}
          variant="ghost"
          boxSize={{ base: '44px', lg: 10 }}
          minW={{ base: '44px', lg: 10 }}
        >
          <LuLanguages />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content
            aria-label={t('nav.languages')}
            minW={36}
            _focusVisible={{
              '& [data-part="item"][data-highlighted]': {
                outline: '2px solid',
                outlineColor: 'colorPalette.focusRing',
                outlineOffset: '-2px',
              },
            }}
          >
            <Menu.RadioItemGroup
              value={language}
              onValueChange={({ value }) => changeLanguage(value)}
            >
              {Object.entries(LANGUAGES).map(([value, name]) => (
                <Menu.RadioItem key={value} value={value} valueText={name} lang={value} minH="44px">
                  <Menu.ItemText flex={1}>{name}</Menu.ItemText>
                  <Menu.ItemIndicator>
                    <LuCheck />
                  </Menu.ItemIndicator>
                </Menu.RadioItem>
              ))}
            </Menu.RadioItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
