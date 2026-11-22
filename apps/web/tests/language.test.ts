import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getInitialLanguage } from '../src/i18n/languages.ts';

test('저장된 언어가 브라우저의 선호 언어보다 우선한다', () => {
  assert.equal(getInitialLanguage('ja', ['ko-KR', 'en-US']), 'ja');
});

test('저장 언어가 유효하지 않으면 브라우저 순서대로 지원 언어를 찾는다', () => {
  assert.equal(getInitialLanguage('fr', ['fr-FR', 'en-GB', 'ja-JP']), 'en');
  assert.equal(getInitialLanguage(null, ['zh-CN', 'en-US']), 'zh-Hans');
  assert.equal(getInitialLanguage(null, ['zh-Hans-SG']), 'zh-Hans');
  assert.equal(getInitialLanguage(null, ['zh-Hant-TW', 'ja-JP']), 'ja');
  assert.equal(getInitialLanguage(null, ['zh-TW', 'fr-FR']), 'ko');
});
