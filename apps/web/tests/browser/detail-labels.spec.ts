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
  expect(rect?.width).toBeGreaterThanOrEqual(24);
  expect(rect?.height).toBeGreaterThanOrEqual(44);
}

test('abbreviated sentence tags show descriptions without changing tag expansion', async ({
  page,
  isMobile,
}) => {
  const region = await openAnalysis(page, conditionalAnalysis('If I am late'));
  await page.getByRole('switch', { name: '약칭' }).press('Space');
  const card = region.locator(
    '[data-segment-begin="0"][data-segment-end="4"] > .constituent-labels',
  );
  const expand = card.getByRole('button', { name: 'advl 상세 태그 (1~4 단어)' });
  const label = isMobile ? card.getByRole('button', { name: 'advl', exact: true }) : expand;
  const description = page.getByRole('tooltip').filter({ hasText: '부사어' });

  if (isMobile) await label.tap();
  else await label.hover();
  await expect(description).toBeVisible();
  await expect(description).toContainText('부사어');
  await expect(expand).toHaveAttribute('aria-expanded', 'false');

  if (isMobile) {
    await label.tap();
    await expect(description).toBeHidden();
    await label.tap();
    await expect(description).toBeVisible();
    await region.getByText('If', { exact: true }).tap();
    await expect(description).toBeHidden();
    await label.tap();
    await expect
      .poll(() =>
        description.evaluate((element) => {
          const { left, right, top, bottom } = element.getBoundingClientRect();
          return left >= 0 && right <= innerWidth && top >= 0 && bottom <= innerHeight;
        }),
      )
      .toBe(true);
    expect(await region.evaluate((element) => (element.scrollLeft += 100))).toBeGreaterThan(0);
    await expect(description).toBeHidden();
    await expand.tap();
  } else {
    await page.mouse.move(0, 0);
    await expect(description).toBeHidden();
    await page.keyboard.press('Tab');
    await label.focus();
    await expect(description).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(description).toBeHidden();
    await expand.press('Enter');
  }
  await expect(expand).toHaveAttribute('aria-expanded', 'true');
  await expect(region.locator('[data-constituent-label="conjunction"]')).toBeVisible();

  await page.getByRole('switch', { name: '태그 설명' }).press('Space');
  await expect(description).toBeHidden();
  await expect(card.getByRole('button', { name: 'advl', exact: true })).toHaveCount(0);
  await expand.press('Enter');
  await expect(expand).toHaveAttribute('aria-expanded', 'false');
});

test('sentence tag descriptions stay out of range selection and deletion', async ({
  page,
  isMobile,
}) => {
  await page.addInitScript(() => localStorage.setItem('syntax-analyzer-language', 'ko'));
  await page.goto('/editor/sample/0');
  // The devtools launcher covers the editor toolbar at this mobile viewport size.
  await page.addStyleTag({ content: '#jotai-devtools-root { display: none }' });
  const region = page.getByRole('region', { name: '구문 문장' });
  const subject = region.getByRole('button', { name: '주어', exact: true });
  const description = page.getByRole('tooltip').filter({ hasText: '문장의 주체를 나타내는' });
  if (isMobile) await subject.tap();
  else await subject.hover();
  await expect(description).toBeVisible();

  if (isMobile) await page.getByRole('button', { name: '태그 선택', exact: true }).tap();
  await page.getByRole('button', { name: '간접 목적어', exact: true }).click();
  await expect(description).toBeHidden();
  await expect(subject).toHaveCount(0);

  const applyRange = async (firstWord: string) => {
    const first = region.getByText(firstWord, { exact: true });
    const last = region.getByText('is', { exact: true });
    if (isMobile) {
      await first.tap();
      await last.tap();
      await page.getByRole('button', { name: '적용', exact: true }).tap();
      return;
    }
    const start = await first.boundingBox();
    const end = await last.boundingBox();
    if (!start || !end) throw new Error('Missing sample words');
    await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2);
    await page.mouse.down();
    await page.mouse.move(end.x + end.width / 2, end.y + end.height / 2, { steps: 4 });
    await page.mouse.up();
  };

  await applyRange('warming');
  await expect(
    page.getByRole('alert').filter({ hasText: '구/절은 서로 교차할 수 없어요' }),
  ).toBeVisible();
  const addedTag = region.getByText('간접 목적어', { exact: true });
  await expect(addedTag).toHaveCount(0);
  if (isMobile) await page.getByRole('button', { name: '선택 취소' }).tap();
  await applyRange('Global');
  await expect(addedTag).toBeVisible();

  const deleteMode = page.getByRole('button', { name: '태그 삭제', exact: true });
  if (isMobile) {
    await deleteMode.tap();
    await addedTag.tap();
  } else {
    await deleteMode.click();
    await addedTag.click();
  }
  await expect(addedTag).toHaveCount(0);
  await expect(region.getByText('주어', { exact: true }).first()).toBeVisible();
});

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

test('individual disclosures toggle independently after expanding all tags', async ({
  page,
  isMobile,
}) => {
  const region = await openAnalysis(page, conditionalAnalysis('If I am late'));
  const adverbial = region.getByRole('button', { name: '부사어 상세 태그 (1~4 단어)' });
  const subject = region.getByRole('button', { name: '주어 상세 태그 (6~7 단어)' });
  const adverbialClause = region.getByText('부사절', { exact: true });
  const conjunction = region.getByText('접속사', { exact: true });
  const expandAll = region.getByRole('button', { name: '전체 태그 펼치기' });
  const collapseAll = region.getByRole('button', { name: '전체 태그 접기' });

  await expandAll.press('Enter');
  await expect(adverbial).toHaveAttribute('aria-expanded', 'true');
  await expectDisclosureSize(adverbial, isMobile);
  await expect(adverbialClause).toBeVisible();
  await expect(conjunction).toBeVisible();

  if (isMobile) await adverbial.tap();
  else await adverbial.press('Enter');
  await expect(adverbial).toHaveAttribute('aria-expanded', 'false');
  if (!isMobile) await expect(adverbial).toBeFocused();
  await expect(adverbialClause).toBeHidden();
  await expect(conjunction).toBeHidden();
  await expect(subject).toHaveAttribute('aria-expanded', 'true');
  await expect(expandAll).toHaveAttribute('aria-expanded', 'false');
  await expectCardLayout(region);

  await adverbial.press('Enter');
  await expect(adverbialClause).toBeVisible();
  await expect(conjunction).toBeVisible();
  await expect(collapseAll).toHaveAttribute('aria-expanded', 'true');

  await subject.press('Enter');
  await expect(subject).toHaveAttribute('aria-expanded', 'false');
  await expandAll.press('Enter');
  await expect(subject).toHaveAttribute('aria-expanded', 'true');
  await collapseAll.press('Enter');
  await expect(subject).toHaveAttribute('aria-expanded', 'false');
  await expect(adverbial).toHaveAttribute('aria-expanded', 'false');
  await expect(adverbialClause).toBeHidden();
});

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
        segment(3, 5, ['noun phrase', 'subject']),
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

test('opening the last nested detail updates the all-tags button', async ({ page }) => {
  const region = await openAnalysis(page, dawnAnalysis());
  const expandAll = region.getByRole('button', { name: '전체 태그 펼치기' });
  const collapseAll = region.getByRole('button', { name: '전체 태그 접기' });
  const time = region.getByRole('button', { name: '부사어 상세 태그 (1~2 단어)' });
  const subject = region.getByRole('button', { name: '주어 상세 태그 (4~5 단어)' });
  const agent = region.getByRole('button', { name: '부사어 상세 태그 (8~10 단어)' });
  const nested = region.getByRole('button', { name: '전치사 목적어 상세 태그 (9~10 단어)' });

  await time.press('Enter');
  await subject.press('Enter');
  await agent.press('Enter');
  await expect(nested).toHaveAttribute('aria-expanded', 'false');
  await expect(expandAll).toHaveAttribute('aria-expanded', 'false');

  await nested.press('Enter');
  await expect(collapseAll).toHaveAttribute('aria-expanded', 'true');
  await nested.press('Enter');
  await expect(expandAll).toHaveAttribute('aria-expanded', 'false');
  await nested.press('Enter');
  await collapseAll.press('Enter');

  await expect(expandAll).toHaveAttribute('aria-expanded', 'false');
  await expect(time).toHaveAttribute('aria-expanded', 'false');
  await expect(subject).toHaveAttribute('aria-expanded', 'false');
  await expect(agent).toHaveAttribute('aria-expanded', 'false');
  await expect(nested).toBeHidden();
});

for (const theme of ['light', 'dark']) {
  test(`subject tags keep their order, colors, and spacing in both expansion modes (${theme})`, async ({
    page,
  }) => {
    await page.addInitScript((mode) => localStorage.setItem('chakra-ui-color-mode', mode), theme);
    const region = await openAnalysis(page, dawnAnalysis());
    await expect(page.locator('html')).toHaveClass(new RegExp(`\\b${theme}\\b`));
    const group = region.locator('[data-segment-begin="3"][data-segment-end="5"]');
    const subject = group.getByRole('button', { name: '주어 상세 태그 (4~5 단어)' });
    const labels = group.locator('.constituent-label');
    const measureGroup = () =>
      group.evaluate((element) => {
        const frame = element.querySelector('.constituent-labels');
        const word = element.querySelector('[data-token-index]');
        if (!frame || !word) throw new Error('Missing subject card or word');
        const connector = getComputedStyle(element, '::before');
        return {
          wordColor: getComputedStyle(word).color,
          connectorColor: connector.borderBottomColor,
          labelColors: Array.from(
            frame.querySelectorAll('.constituent-label'),
            (label) => getComputedStyle(label).color,
          ),
          cardHeight: frame.getBoundingClientRect().height,
        };
      });

    await subject.press('Enter');
    await expect(labels).toHaveText(['주어', '명사구']);
    const individual = await measureGroup();
    await subject.press('Enter');
    await expect(labels).toHaveText(['주어']);

    await region.getByRole('button', { name: '전체 태그 펼치기' }).press('Enter');
    await expect(labels).toHaveText(['주어', '명사구']);
    await expect.poll(measureGroup).toEqual(individual);
    await expectCardLayout(region);
  });
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
    const details = parentCard.getByRole('button', { name: /상세 태그|details \(words/ });
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

test('syntax labels keep balanced padding without moving words', async ({ page, isMobile }) => {
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
        segment(3, 5, ['verb'], [segment(3, 4, ['perfect auxiliary']), segment(4, 5, ['verb'])]),
        segment(
          5,
          8,
          ['adverbial', 'prepositional phrase'],
          [segment(6, 8, ['noun phrase', 'prepositional object'])],
        ),
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
  const mainVerb = region.locator(
    '[data-segment-begin="4"][data-segment-end="5"] .constituent-label',
  );
  await expect(mainVerb).toHaveText('동사');
  await expectCardLayout(region);
  expect(await wordLayout(region)).toEqual(baseline);

  if (isMobile) {
    await expect(region.getByText('완료 조동사', { exact: true })).toHaveCSS(
      'padding-inline-start',
      '10px',
    );
    await expect(mainVerb).toHaveCSS('padding-inline-start', '10px');
    const objectCard = region.locator(
      '[data-segment-begin="6"][data-stacked-labels] > .constituent-labels',
    );
    await expect(objectCard).toBeVisible();
    const [top, bottom] = await objectCard.evaluate((frame) => {
      const [first, last] = frame.querySelectorAll('.constituent-label');
      const lineHeight = parseFloat(getComputedStyle(first).lineHeight);
      const top = (first.getBoundingClientRect().height - lineHeight) / 2;
      return [top, parseFloat(getComputedStyle(last).paddingBlockEnd)];
    });
    expect(bottom).toBeCloseTo(top);
  }

  await page.getByRole('switch', { name: '약칭' }).press('Space');
  await expect(mainVerb).toHaveText('v');
  if (isMobile) await expect(mainVerb).toHaveCSS('width', '32px');
  await expectCardLayout(region);
  expect(await wordLayout(region)).toEqual(baseline);

  await region.getByRole('button', { name: '전체 태그 접기' }).press('Enter');
  const verbDisclosure = region.getByRole('button', { name: 'v 상세 태그 (4~5 단어)' });
  await expect(verbDisclosure).toBeVisible();
  await expect(verbDisclosure).toHaveCSS('padding-block-start', isMobile ? '11.5px' : '6.5px');
  await expect(verbDisclosure).toHaveCSS('padding-block-end', isMobile ? '12.5px' : '7.5px');
  await expectDisclosureSize(verbDisclosure, isMobile);

  if (isMobile) {
    for (const abbreviation of ['s', 'v', 'advl']) {
      const label = region.getByRole('button', { name: abbreviation, exact: true }).first();
      await expectDisclosureSize(label, true);
      const [left, right, gap] = await label.evaluate((button) => {
        const card = button.closest('.constituent-labels');
        const chevron = button.nextElementSibling?.querySelector('svg');
        if (!card || !chevron) throw new Error('Missing disclosure card or chevron');
        const range = document.createRange();
        range.selectNodeContents(button);
        const text = range.getBoundingClientRect();
        const icon = chevron.getBoundingClientRect();
        const frame = card.getBoundingClientRect();
        return [text.left - frame.left, frame.right - icon.right, icon.left - text.right];
      });
      expect(left).toBeGreaterThanOrEqual(7.5);
      expect(right).toBeGreaterThanOrEqual(7.5);
      expect(gap).toBeLessThanOrEqual(8);
    }
  }
});

test('shared clause details hide redundant buttons and keep individual details available', async ({
  page,
  isMobile,
}) => {
  const sentence = 'Our town has banned lawn watering , so the grass looks brown .'.split(' ');
  const verbChildren = [segment(2, 3, ['perfect auxiliary']), segment(3, 4, ['verb'])];
  const firstClause = segment(
    0,
    6,
    ['coordinating clause'],
    [
      segment(0, 2, ['subject']),
      segment(2, 4, ['verb'], verbChildren),
      segment(4, 6, ['object', 'noun phrase']),
    ],
  );
  const region = await openAnalysis(page, {
    id: 'lawn-watering',
    source: 'user',
    createdAt: '2026-11-27T00:00:00.000Z',
    sentence,
    isAnalyzedByGPT: true,
    rootSegment: segment(
      0,
      sentence.length,
      [],
      [
        firstClause,
        segment(7, 8, ['conjunction']),
        segment(8, 10, ['subject', 'noun phrase']),
        segment(10, 11, ['verb']),
        segment(11, 12, ['subject complement']),
      ],
    ),
  });

  const subject = region.getByRole('button', { name: '주어 상세 태그 (1~2 단어)' });
  const verb = region.getByRole('button', { name: '동사 상세 태그 (3~4 단어)' });
  const object = region.getByRole('button', { name: '목적어 상세 태그 (5~6 단어)' });
  const clause = region.getByText('등위절', { exact: true });

  await expect(subject).toHaveAttribute('aria-expanded', 'false');
  if (isMobile) await verb.tap();
  else await verb.press('Enter');
  await expect(clause).toBeVisible();
  await expect(subject).toHaveCount(0);
  await expect(verb).toHaveAttribute('aria-expanded', 'true');
  if (!isMobile) await expect(verb).toBeFocused();

  await object.press('Enter');
  await expect(region.getByText('명사구', { exact: true })).toBeVisible();
  await verb.press('Enter');
  await expect(clause).toBeVisible();
  await expect(subject).toHaveCount(0);

  await object.press('Enter');
  await expect(object).toBeFocused();
  await expect(clause).toBeHidden();
  await expect(subject).toHaveAttribute('aria-expanded', 'false');
});

test('expanded tags show complete prepositional objects and the main verb separately', async ({
  page,
}) => {
  const sentence = 'Maya would weigh rent costs against a shorter commute .'.split(' ');
  const region = await openAnalysis(page, {
    id: 'auxiliary-and-prepositional-object',
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
        segment(1, 3, ['verb'], [segment(1, 2, ['modal verb']), segment(2, 3, ['verb'])]),
        segment(3, 5, ['object', 'noun phrase']),
        segment(
          5,
          9,
          ['prepositional phrase'],
          [segment(6, 9, ['noun phrase', 'prepositional object'])],
        ),
      ],
    ),
  });

  const verbGroup = region.getByRole('button', { name: '동사 상세 태그 (2~3 단어)' });
  const mainVerb = region
    .locator('[data-segment-begin="2"][data-segment-end="3"]')
    .getByText('동사', { exact: true });
  await expect(verbGroup).toBeVisible();
  await expect(mainVerb).toHaveCount(0);
  await verbGroup.press('Enter');
  await expect(mainVerb).toBeVisible();

  await region.getByRole('button', { name: '전체 태그 펼치기' }).press('Enter');
  const phrase = region.locator('[data-segment-begin="5"][data-segment-end="9"]');
  const complement = phrase.locator('[data-segment-begin="6"][data-segment-end="9"]');
  await expect(phrase.getByText('전치사구', { exact: true })).toBeVisible();
  await expect(complement.getByText('명사구', { exact: true })).toBeVisible();
  await expect(complement.getByText('전치사 목적어', { exact: true })).toBeVisible();
  await expect(
    region
      .locator('[data-segment-begin="1"][data-segment-end="2"]')
      .getByText('조동사', { exact: true }),
  ).toBeVisible();
  await expect(mainVerb).toBeVisible();
});
