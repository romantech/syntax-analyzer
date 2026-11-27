import { expect, type Locator, type Page, test } from '@playwright/test';

import { SYNTAX_CONSTITUENTS } from 'syntax-analyzer-shared/syntax-constituents.js';
import type { TAnalysis, TSegment } from '../../src/features/syntax-editor/types/analysis';

let nextId = 0;

function segment(
  begin: number,
  end: number,
  labels: string[],
  children: TSegment[] = [],
): TSegment {
  return {
    id: ++nextId,
    begin,
    end,
    constituents: labels.map((label) => {
      const tag = SYNTAX_CONSTITUENTS.find((tag) => tag.label === label);
      if (!tag) throw new Error(`Unknown syntax label: ${label}`);
      const type = tag.type === 'token' && end - begin > 1 ? 'token-group' : tag.type;
      return { ...tag, type, id: ++nextId };
    }),
    children,
  };
}

function conditionalAnalysis(clause: 'If I am late' | 'If guests arrive late'): TAnalysis {
  const sentence = [
    ...clause.split(' '),
    ',',
    'our',
    'cafe',
    'holds',
    'their',
    'table',
    'for',
    'ten',
    'minutes',
    '.',
  ];
  return {
    id: 'conditional',
    source: 'user',
    createdAt: '2026-11-27T00:00:00.000Z',
    sentence,
    isAnalyzedByGPT: true,
    rootSegment: segment(
      0,
      sentence.length,
      [],
      [
        segment(
          0,
          4,
          ['adverbial clause'],
          [
            segment(0, 1, ['conjunction']),
            segment(1, 2, ['subject']),
            segment(2, 3, ['verb']),
            segment(3, 4, [clause === 'If I am late' ? 'subject complement' : 'adverb']),
          ],
        ),
        segment(5, 7, ['subject', 'noun phrase']),
        segment(7, 8, ['verb']),
        segment(8, 10, ['direct object', 'noun phrase']),
        segment(
          10,
          13,
          ['prepositional phrase'],
          [segment(11, 13, ['prepositional object', 'noun phrase'])],
        ),
      ],
    ),
  };
}

async function openAnalysis(page: Page, analysis: TAnalysis, language: 'ko' | 'en' = 'ko') {
  await page.addInitScript(
    (language) => localStorage.setItem('syntax-analyzer-language', language),
    language,
  );
  await page.route('**/api/analyzer/remaining-counts', (route) =>
    route.fulfill({ json: { analysis: 10, random_sentence: 10 } }),
  );
  await page.route('**/api/analyzer', (route) => route.fulfill({ json: analysis }));
  await page.goto('/analyzer');
  await page
    .getByPlaceholder(language === 'ko' ? '영어 문장 입력' : 'Enter an English sentence')
    .fill(analysis.sentence.join(' ').replace(/ ([,.])/g, '$1'));
  const analyze = { name: language === 'ko' ? '분석' : 'Analyze', exact: true };
  await page.getByRole('button', analyze).click();
  await page.getByRole('alertdialog').getByRole('button', analyze).click();

  const region = page.getByRole('region', { name: /구문 문장|Sentence structure/ });
  await expect(region.locator('.constituent-labels').first()).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  return region;
}

function labelOverlaps(region: Locator) {
  return region.locator('.constituent-labels').evaluateAll((elements) => {
    const cards = elements.map((element) => ({
      name: element.textContent,
      rect: element.getBoundingClientRect(),
    }));
    return cards.flatMap(({ rect: a, name }, index) =>
      cards.slice(index + 1).flatMap(({ rect: b, name: other }) => {
        const width = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const height = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        return width > 0.5 && height > 0.5 ? [{ name, other, width, height }] : [];
      }),
    );
  });
}

test('short adjacent words have separate detail cards', async ({ page, isMobile }) => {
  const region = await openAnalysis(page, conditionalAnalysis('If I am late'));
  const details = region.getByRole('button', { name: '부사어 상세 태그 (1~4 단어)' });
  if (isMobile) await details.tap();
  else await details.click();
  await expect(region.getByText('접속사', { exact: true })).toBeVisible();

  expect(await labelOverlaps(region)).toEqual([]);
});

function printingAnalysis(): TAnalysis {
  const sentence = ['Leo', 'will', 'come', 'to', 'print', 'for', 'us', 'before', 'noon', '.'];
  return {
    id: 'printing',
    source: 'user',
    createdAt: '2026-11-27T00:00:00.000Z',
    sentence,
    isAnalyzedByGPT: true,
    rootSegment: segment(
      0,
      sentence.length,
      [],
      [
        segment(0, 1, ['subject']),
        segment(1, 3, ['verb', 'verb phrase'], [segment(1, 2, ['modal verb'])]),
        segment(3, 5, ['adverbial', 'to-infinitive'], [segment(4, 5, ['verb'])]),
        segment(5, 7, ['prepositional phrase'], [segment(6, 7, ['prepositional object'])]),
        segment(7, 9, ['prepositional phrase'], [segment(8, 9, ['prepositional object'])]),
      ],
    ),
  };
}

function wordLayout(region: Locator) {
  return region.evaluate((viewport) => {
    const sentence = viewport.querySelector('p.notranslate');
    if (!sentence) throw new Error('Sentence is missing');
    const left = viewport.getBoundingClientRect().left - viewport.scrollLeft;
    const { top } = sentence.getBoundingClientRect();
    return {
      scrollWidth: viewport.scrollWidth,
      words: Array.from(sentence.querySelectorAll('[data-token-index]'), (word) => {
        const rect = word.getBoundingClientRect();
        return [rect.left - left, rect.top - top, rect.width].map((value) =>
          Math.round(value * 64),
        );
      }),
    };
  });
}

function cardLayoutIssues(region: Locator) {
  return region.evaluate((viewport) => {
    const sentence = viewport.querySelector('p.notranslate');
    if (!sentence) throw new Error('Sentence is missing');
    const sentenceBottom = sentence.getBoundingClientRect().bottom;
    const scrollLeft = viewport.getBoundingClientRect().left - viewport.scrollLeft;
    const issues = [];

    for (const frame of sentence.querySelectorAll('.constituent-labels')) {
      const { left, right, top, bottom } = frame.getBoundingClientRect();
      const name = frame.textContent;
      if (left < scrollLeft - 0.5 || bottom > sentenceBottom + 0.5) {
        issues.push({ name, issue: 'card outside the scroll area', left, scrollLeft });
      }
      for (const label of frame.querySelectorAll('.constituent-label')) {
        const range = document.createRange();
        range.selectNodeContents(label);
        for (const rect of range.getClientRects()) {
          if (
            rect.left < left - 0.5 ||
            rect.right > right + 0.5 ||
            rect.top < top - 0.5 ||
            rect.bottom > bottom + 0.5
          ) {
            issues.push({ name, issue: 'clipped label text or caret' });
          }
        }
      }
      const group = frame.parentElement;
      if (!group?.classList.contains('token-group')) continue;

      const connector = getComputedStyle(group, '::before');
      const lineEnd =
        group.getBoundingClientRect().top +
        Number.parseFloat(connector.top) +
        Number.parseFloat(connector.height);
      if (connector.borderBottomStyle !== 'dashed' || !(lineEnd >= top && lineEnd <= bottom)) {
        issues.push({ name, issue: 'connector does not reach the label' });
      }
      for (const childFrame of group.querySelectorAll(':scope .constituent .constituent-labels')) {
        if (childFrame.getBoundingClientRect().bottom > top + 0.5) {
          issues.push({ name, issue: 'parent card above a child card' });
        }
      }
    }
    return issues;
  });
}

async function expectCardLayout(region: Locator) {
  await expect.poll(() => cardLayoutIssues(region)).toEqual([]);
  expect(await labelOverlaps(region)).toEqual([]);
}

async function expectDisclosureSize(button: Locator, isMobile: boolean) {
  if (!isMobile) return;
  const rect = await button.boundingBox();
  expect(rect?.width).toBeGreaterThanOrEqual(44);
  expect(rect?.height).toBeGreaterThanOrEqual(44);
}

for (const language of ['ko', 'en'] as const) {
  test(`individual and full disclosures preserve the sentence layout (${language})`, async ({
    page,
    isMobile,
  }) => {
    const region = await openAnalysis(page, conditionalAnalysis('If I am late'), language);
    const abbreviations = page.getByRole('switch', { name: /약칭|Abbreviations/ });
    const details = region.getByRole('button', {
      name: /(?:부사어|adverbial|advl) (?:상세 태그|details)/,
    });
    const expandAll = region.getByRole('button', { name: /전체 태그 펼치기|Expand all tags/ });
    const collapseAll = region.getByRole('button', { name: /전체 태그 접기|Collapse all tags/ });

    for (const abbreviated of [false, true]) {
      if (abbreviated) {
        await abbreviations.press('Space');
        await expect(abbreviations).toBeChecked();
      }
      const baseline = await wordLayout(region);
      await expectDisclosureSize(details, isMobile);
      await details.press('Enter');
      await expect(details).toBeFocused();
      await expect(details).toHaveAttribute('aria-expanded', 'true');
      if (!isMobile) await expect(details).toHaveCSS('outline-style', 'solid');
      await expectDisclosureSize(details, isMobile);
      await expectCardLayout(region);
      expect(await wordLayout(region)).toEqual(baseline);

      await details.press('Enter');
      await expect(details).toHaveAttribute('aria-expanded', 'false');
      expect(await wordLayout(region)).toEqual(baseline);

      await expandAll.click();
      await expect(collapseAll).toBeVisible();
      await expectCardLayout(region);
      expect(await wordLayout(region)).toEqual(baseline);
      await collapseAll.click();
      await expect(expandAll).toBeVisible();
      expect(await wordLayout(region)).toEqual(baseline);
    }
  });
}

test('conditional cards that fit stay on the same row', async ({ page }) => {
  const region = await openAnalysis(page, conditionalAnalysis('If guests arrive late'));
  await region.getByRole('button', { name: '부사어 상세 태그 (1~4 단어)' }).click();
  await expectCardLayout(region);
  const conjunction = await region.getByText('접속사', { exact: true }).boundingBox();
  const subject = await region
    .locator('[data-segment-begin="1"] .constituent-label')
    .getByText('주어', { exact: true })
    .boundingBox();
  expect(conjunction?.y).toBeCloseTo(subject?.y ?? Number.NaN, 1);
});

function dawnAnalysis(firstWords: [string, string] = ['Before', 'dawn']): TAnalysis {
  const sentence = [
    ...firstWords,
    ',',
    'the',
    'lanterns',
    'were',
    'dimmed',
    'by',
    'the',
    'caretaker',
    '.',
  ];
  return {
    id: 'dawn',
    source: 'user',
    createdAt: '2026-11-27T00:00:00.000Z',
    sentence,
    isAnalyzedByGPT: true,
    rootSegment: segment(
      0,
      sentence.length,
      [],
      [
        segment(
          0,
          2,
          ['adverbial', 'prepositional phrase'],
          [segment(1, 2, ['prepositional object'])],
        ),
        segment(3, 5, ['subject', 'noun phrase']),
        segment(5, 7, ['verb'], [segment(5, 6, ['passive auxiliary'])]),
        segment(
          7,
          10,
          ['adverbial', 'prepositional phrase'],
          [segment(8, 10, ['prepositional object', 'noun phrase'])],
        ),
      ],
    ),
  };
}

test('a wrapped detail fits the widest line without extra side padding', async ({ page }) => {
  const region = await openAnalysis(page, dawnAnalysis(['At', '5']));
  await region.getByRole('button', { name: '부사어 상세 태그 (1~2 단어)' }).click();
  await expectCardLayout(region);

  const measurePadding = (label: Locator) =>
    label.evaluate((element) => {
      const range = document.createRange();
      range.selectNodeContents(element);
      const lines = [...range.getClientRects()];
      return {
        lineCount: lines.length,
        inlinePadding:
          element.getBoundingClientRect().width - Math.max(...lines.map((line) => line.width)),
      };
    });
  const detail = await measurePadding(region.getByText('전치사 목적어', { exact: true }));
  const auxiliary = await measurePadding(region.getByText('수동 조동사', { exact: true }));
  expect(detail.lineCount).toBe(2);
  expect(Math.abs(detail.inlinePadding - auxiliary.inlinePadding)).toBeLessThanOrEqual(1);
});

for (const language of ['ko', 'en'] as const) {
  test(`nested detail uses available space inside its phrase (${language})`, async ({
    page,
    isMobile,
  }) => {
    const region = await openAnalysis(page, dawnAnalysis(), language);
    const group = region.locator('[data-segment-begin="0"][data-segment-end="2"]');
    const parentCard = group.locator(':scope > .constituent-labels');
    const childCard = group.locator('[data-segment-begin="1"] > .constituent-labels');
    const verbCard = region.locator(
      '[data-segment-begin="5"][data-segment-end="7"] > .constituent-labels',
    );
    const details = parentCard.getByRole('button');
    const expandAll = region.getByRole('button', { name: /전체 태그 펼치기|Expand all tags/ });
    const collapseAll = region.getByRole('button', { name: /전체 태그 접기|Collapse all tags/ });
    const abbreviations = page.getByRole('switch', { name: /약칭|Abbreviations/ });

    for (const abbreviated of [false, true]) {
      if (abbreviated) {
        await abbreviations.press('Space');
        await expect(abbreviations).toBeChecked();
      }
      const baseline = await wordLayout(region);
      await expectDisclosureSize(details, isMobile);

      for (const toggle of [details, expandAll]) {
        await toggle.press('Enter');
        await expect(childCard).toBeVisible();
        const lineCount = await childCard.locator('.constituent-label').evaluate((label) => {
          const range = document.createRange();
          range.selectNodeContents(label);
          return range.getClientRects().length;
        });
        expect(lineCount).toBe(1);
        const childBounds = await childCard.boundingBox();
        const groupBounds = await group.boundingBox();
        if (!childBounds || !groupBounds) throw new Error('Missing phrase or detail bounds');
        expect(childBounds.x).toBeGreaterThanOrEqual(groupBounds.x - 0.5);
        expect(childBounds.x + childBounds.width).toBeLessThanOrEqual(
          groupBounds.x + groupBounds.width + 0.5,
        );
        if (toggle === details) {
          expect((await parentCard.boundingBox())?.y).toBeCloseTo(
            (await verbCard.boundingBox())?.y ?? Number.NaN,
            1,
          );
        }
        await expectCardLayout(region);
        expect(await wordLayout(region)).toEqual(baseline);

        if (toggle === details) {
          await expect(details).toBeFocused();
          await expectDisclosureSize(details, isMobile);
          await details.press('Enter');
        } else {
          await collapseAll.press('Enter');
        }
        await expect(childCard).toBeHidden();
        expect(await wordLayout(region)).toEqual(baseline);
      }
    }
  });
}

test('auxiliary and wrapped phrase labels keep their spacing and connectors', async ({ page }) => {
  const region = await openAnalysis(page, printingAnalysis());
  const baseline = await wordLayout(region);
  const subject = await region.getByText('주어', { exact: true }).boundingBox();
  const auxiliary = await region.getByText('조동사', { exact: true }).boundingBox();
  expect(subject?.height).toEqual(auxiliary?.height);

  await region.getByRole('button', { name: '부사어 상세 태그 (4~5 단어)' }).click();
  await region.getByRole('button', { name: /전치사구 상세 태그 \(6~7 단어\)/ }).click();
  await expectCardLayout(region);
  expect(await wordLayout(region)).toEqual(baseline);

  const words = await region.getByText('전치사 목적어', { exact: true }).evaluate((label) => {
    const text = label.firstChild;
    if (!text) throw new Error('Label text is missing');
    return [
      [0, 3],
      [4, 7],
    ].map(([start, end]) => {
      const range = document.createRange();
      range.setStart(text, start);
      range.setEnd(text, end);
      const rects = Array.from(range.getClientRects());
      return { lines: rects.length, top: rects[0].top };
    });
  });
  expect(words.map(({ lines }) => lines)).toEqual([1, 1]);
  expect(words[1].top).toBeGreaterThan(words[0].top);
});

test('a wide auxiliary label does not add space between words', async ({ page }) => {
  const sentence = 'A fresh scent has lingered in the kitchen since breakfast .'.split(' ');
  const region = await openAnalysis(page, {
    id: 'fresh-scent',
    source: 'user',
    createdAt: '2026-11-27T00:00:00.000Z',
    sentence,
    isAnalyzedByGPT: true,
    rootSegment: segment(
      0,
      sentence.length,
      [],
      [
        segment(0, 3, ['subject', 'noun phrase']),
        segment(3, 5, ['verb'], [segment(3, 4, ['perfect auxiliary'])]),
        segment(5, 8, ['adverbial', 'prepositional phrase']),
        segment(8, 10, ['adverbial', 'prepositional phrase']),
      ],
    ),
  });

  await expect(region.getByText('완료 조동사', { exact: true })).toBeVisible();
  const baseline = await wordLayout(region);
  const gaps = baseline.words.slice(1).map(([left], index) => {
    const [previousLeft, , previousWidth] = baseline.words[index];
    return (left - previousLeft - previousWidth) / 64;
  });
  expect(Math.max(...gaps)).toBeLessThanOrEqual(1);

  const subject = region.getByRole('button', { name: '주어 상세 태그 (1~3 단어)' });
  await subject.press('Enter');
  await expect(subject).toHaveAttribute('aria-expanded', 'true');
  await expectCardLayout(region);
  expect(await wordLayout(region)).toEqual(baseline);

  await region.getByRole('button', { name: '전체 태그 펼치기' }).press('Enter');
  await expectCardLayout(region);
  expect(await wordLayout(region)).toEqual(baseline);
});
