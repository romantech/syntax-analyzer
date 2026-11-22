import type { TFunction } from 'i18next';

import ko from '@/i18n/locales/ko/translation.json';

import type { ConstituentWithoutId } from '../types';

type TagKey = keyof typeof ko.tags;

function isTagKey(key: string): key is TagKey {
  return Object.hasOwn(ko.tags, key);
}

export function getConstituentTranslation(t: TFunction, tag: ConstituentWithoutId) {
  const key = `tag${tag.elementId}`;
  if (!isTagKey(key)) return { name: tag.label, description: tag.label };

  return {
    name: t(`tags.${key}.name`),
    description: t(`tags.${key}.description`),
  };
}
