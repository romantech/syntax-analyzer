import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createInstance } from 'i18next';

import { getConstituentTranslation } from '../src/features/syntax-editor/helpers/constituent-translation.ts';
import ko from '../src/i18n/locales/ko/translation.json' with { type: 'json' };

const i18n = createInstance();

await i18n.init({ lng: 'ko', resources: { ko: { translation: ko } } });

test('예전 태그 번호가 다른 문법 항목에 재사용되어도 저장된 태그 이름을 번역한다', () => {
  const legacyTag = { elementId: 5, label: 'object', abbreviation: 'o', type: 'token' } as const;

  assert.equal(getConstituentTranslation(i18n.t, legacyTag).name, '목적어');
});

test('번역 목록에서 사라진 태그는 저장된 이름을 표시한다', () => {
  const legacyTag = {
    elementId: 3,
    label: 'auxiliary verb',
    abbreviation: 'aux.v',
    type: 'token',
  } as const;

  assert.equal(getConstituentTranslation(i18n.t, legacyTag).name, legacyTag.label);
});
