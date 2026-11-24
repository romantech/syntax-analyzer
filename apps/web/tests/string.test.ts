import assert from 'node:assert/strict';
import { test } from 'node:test';

import { expandAbbreviations, tokenizer } from '../src/base/utils/string.ts';

test('소유격을 그대로 분석 토큰에 전달한다', () => {
  const sentence = "In 1066, William's fleet redrew England's destiny overnight.";

  assert.deepEqual(tokenizer(expandAbbreviations(sentence)), [
    'In',
    '1066',
    ',',
    "William's",
    'fleet',
    'redrew',
    "England's",
    'destiny',
    'overnight',
    '.',
  ]);
});

test('문맥에 따라 의미가 달라지는 축약형을 유지한다', () => {
  const sentence = "I think he's arrived, but it's too early to tell if she's ready.";

  assert.equal(expandAbbreviations(sentence), sentence);
});

test('기존의 명확한 축약형은 풀어서 전달한다', () => {
  assert.equal(expandAbbreviations("I'll go if you can't."), 'I will go if you cannot.');
  assert.equal(expandAbbreviations("So let's go now."), 'So let us go now.');
});
