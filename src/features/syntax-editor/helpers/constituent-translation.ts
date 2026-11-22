import type { TFunction } from 'i18next';

import ko from '../../../i18n/locales/ko/translation.json' with { type: 'json' };
import { SYNTAX_CONSTITUENTS } from '../data/syntax-constituents.ts';
import type { ConstituentWithoutId } from '../types';

type TagKey = keyof typeof ko.tags;

// Saved analyses can use older numeric IDs for the same grammar label.
const tagKeysByLabel = new Map(
  SYNTAX_CONSTITUENTS.map(({ label, elementId }) => [label, `tag${elementId}`]),
);

function isTagKey(key: string): key is TagKey {
  return Object.hasOwn(ko.tags, key);
}

export function getConstituentTranslation(t: TFunction, tag: ConstituentWithoutId) {
  const key = tagKeysByLabel.get(tag.label);
  if (!key || !isTagKey(key)) return { name: tag.label, description: tag.label };

  return {
    name: t(`tags.${key}.name`),
    description: t(`tags.${key}.description`),
  };
}
