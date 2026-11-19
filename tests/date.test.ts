import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getFormattedKoDate, isLessThanAgo } from '../src/base/utils/date.ts';
import { NEW_BADGE_DISPLAY_DURATION } from '../src/features/syntax-editor/constants/settings.ts';

test('저장된 ISO 타임스탬프를 현지 시간의 한국어 날짜로 표시한다', () => {
  const savedAt = new Date(2026, 10, 19, 3, 4, 5).toISOString();

  assert.equal(getFormattedKoDate(savedAt), '2026년 11월 19일(목) 03:04');
});

test('저장 후 5분까지 New 배지를 표시하고 5분이 지나면 숨긴다', (t) => {
  const savedAt = '2026-11-18T18:04:05.000Z';
  const expiresAt = Date.parse(savedAt) + NEW_BADGE_DISPLAY_DURATION * 1000;
  const now = t.mock.method(Date, 'now', () => expiresAt - 1);

  assert.equal(isLessThanAgo(savedAt, NEW_BADGE_DISPLAY_DURATION), true);
  now.mock.mockImplementation(() => expiresAt);
  assert.equal(isLessThanAgo(savedAt, NEW_BADGE_DISPLAY_DURATION), true);
  now.mock.mockImplementation(() => expiresAt + 1);
  assert.equal(isLessThanAgo(savedAt, NEW_BADGE_DISPLAY_DURATION), false);
});
