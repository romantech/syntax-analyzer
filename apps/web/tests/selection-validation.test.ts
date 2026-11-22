import assert from 'node:assert/strict';
import { test } from 'node:test';

import { validateSelectionBounds } from '../src/features/syntax-editor/helpers/selection-validation.ts';
import type { TSegment } from '../src/features/syntax-editor/types/analysis.ts';

const tag = { id: 1, elementId: 1, type: 'token' as const, label: 'subject', abbreviation: 's' };
const group = (
  begin: number,
  end: number,
  constituents = [tag],
  children: TSegment[] = [],
): TSegment => ({
  id: begin + end,
  begin,
  end,
  constituents,
  children,
});
const leaf = (begin: number, end: number) => group(begin, end);
const segment = group(0, 7, [], [leaf(0, 2), leaf(2, 3), leaf(3, 6)]);

test('한 단어·동일 범위·포함 범위는 허용하고 교차는 거부한다', () => {
  for (const [begin, end] of [
    [0, 1],
    [0, 2],
    [0, 3],
    [2, 6],
    [3, 7],
    [0, 7],
  ]) {
    assert.equal(validateSelectionBounds(segment, begin, end), true, `${begin}~${end}`);
  }
  for (const [begin, end] of [
    [1, 3],
    [2, 4],
    [1, 5],
    [5, 7],
  ]) {
    assert.equal(validateSelectionBounds(segment, begin, end), false, `${begin}~${end}`);
  }
});

test('빈 세그먼트 경계는 무시하고 중첩된 태그는 검사한다', () => {
  const nested = group(0, 7, [], [group(0, 6, [], [group(1, 5, [tag], [leaf(2, 4)])])]);
  assert.equal(validateSelectionBounds(nested, 1, 6), true);
  assert.equal(validateSelectionBounds(nested, 2, 4), true);
  assert.equal(validateSelectionBounds(nested, 1, 3), false);
  assert.equal(validateSelectionBounds(nested, 0, 3), false);
});

test('빈 범위·역전 범위·문장 밖·잘못된 인덱스는 거부한다', () => {
  for (const [begin, end] of [
    [0, 0],
    [3, 2],
    [-1, 2],
    [0, 8],
    [0.5, 2],
    [0, NaN],
  ]) {
    assert.equal(validateSelectionBounds(segment, begin, end), false);
  }
});
