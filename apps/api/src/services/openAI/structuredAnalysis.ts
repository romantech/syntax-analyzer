import { randomInt, randomUUID } from 'node:crypto';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { toJsonSchema } from '@langchain/core/utils/json_schema';
import {
  ContentFilterFinishReasonError,
  LengthFinishReasonError,
} from 'openai/core/error';
import { z } from 'zod';
import { SYNTAX_CONSTITUENTS } from '@/constants/syntax-constituents';
import { throwCustomError } from '@/utils/customError';
import type { CreateChatModel } from './openAIUtils';

const analysisSpansSchema = z.object({
  spans: z.array(
    z.object({
      begin: z.number().int().nonnegative(),
      end: z.number().int().positive(),
      tags: z
        .array(z.enum(SYNTAX_CONSTITUENTS.map(({ label }) => label)))
        .min(1),
    }),
  ),
});
const outputSchema = toJsonSchema(analysisSpansSchema);

type Spans = z.infer<typeof analysisSpansSchema>['spans'];
type CatalogEntry = (typeof SYNTAX_CONSTITUENTS)[number];
type Constituent = Omit<CatalogEntry, 'type'> & {
  id: number;
  type: CatalogEntry['type'] | 'token-group';
};
type Segment = {
  id: number;
  begin: number;
  end: number;
  constituents: Constituent[];
  children: Segment[];
};

const catalog = new Map(
  SYNTAX_CONSTITUENTS.map((entry) => [entry.label, entry]),
);
const punctuationOnly = /^[\p{P}\s]+$/u;

const invalidOutput = () =>
  throwCustomError('Invalid sentence analysis.', 502, 'invalid-model-output');

const buildAnalysis = (sentence: string[], spans: Spans) => {
  const ids = new Set<number>();
  const allocateId = () => {
    let id = randomInt(1_000_000_000, 10_000_000_000);
    while (ids.has(id)) id = randomInt(1_000_000_000, 10_000_000_000);
    ids.add(id);
    return id;
  };
  const makeSegment = (begin: number, end: number): Segment => ({
    id: allocateId(),
    begin,
    end,
    constituents: [],
    children: [],
  });

  const rootSegment = makeSegment(0, sentence.length);
  const stack = [rootSegment];

  // At the same start position, visit wider ranges before their descendants.
  for (const { begin, end, tags } of spans.toSorted(
    (a, b) => a.begin - b.begin || b.end - a.end,
  )) {
    if (
      begin >= end ||
      end > sentence.length ||
      sentence.slice(begin, end).every((token) => punctuationOnly.test(token))
    ) {
      return null;
    }

    while (stack.length > 1 && begin >= stack[stack.length - 1].end) {
      stack.pop();
    }
    const parent = stack[stack.length - 1];
    if (end > parent.end) return null;

    const sameRange =
      parent !== rootSegment && parent.begin === begin && parent.end === end;
    const segment = sameRange ? parent : makeSegment(begin, end);
    if (!sameRange) {
      parent.children.push(segment);
      stack.push(segment);
    }

    for (const label of tags) {
      const entry = catalog.get(label);
      if (!entry) return null;
      if (
        segment.constituents.some(
          ({ elementId }) => elementId === entry.elementId,
        )
      ) {
        continue;
      }
      segment.constituents.push({
        ...entry,
        id: allocateId(),
        type:
          entry.type === 'token' && end - begin > 1
            ? 'token-group'
            : entry.type,
      });
    }
  }

  const fillGaps = (segment: Segment) => {
    if (!segment.children.length) return;
    const children: Segment[] = [];
    let begin = segment.begin;
    for (const child of segment.children) {
      if (begin < child.begin) children.push(makeSegment(begin, child.begin));
      fillGaps(child);
      children.push(child);
      begin = child.end;
    }
    if (begin < segment.end) children.push(makeSegment(begin, segment.end));
    segment.children = children;
  };
  fillGaps(rootSegment);

  return {
    id: randomUUID(),
    source: 'user',
    createdAt: new Date().toISOString(),
    isAnalyzedByGPT: true,
    sentence,
    rootSegment,
  } as const;
};

export const generateStructuredAnalysis = async (
  createModel: CreateChatModel,
  model: string,
  sentence: string[],
  { initial, retryInstruction }: { initial: string; retryInstruction: string },
  signal: AbortSignal,
) => {
  signal.throwIfAborted();
  const llm = createModel({
    model,
    reasoning: { effort: 'low' },
    useResponsesApi: false,
  });

  const tokens = new HumanMessage(JSON.stringify(sentence));
  for (const prompt of [initial, `${initial}\n${retryInstruction}`]) {
    signal.throwIfAborted();
    const response = await llm
      .invoke([new SystemMessage(prompt), tokens], {
        signal,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'syntax_analysis',
            schema: outputSchema,
            strict: true,
          },
        },
      })
      .catch((error: unknown) => {
        if (
          error instanceof LengthFinishReasonError ||
          error instanceof ContentFilterFinishReasonError
        ) {
          return invalidOutput();
        }
        throw error;
      });
    signal.throwIfAborted();
    if (response.response_metadata.finish_reason !== 'stop') {
      return invalidOutput();
    }

    let payload: unknown;
    try {
      payload = JSON.parse(response.text);
    } catch {
      return invalidOutput();
    }
    const parsed = analysisSpansSchema.safeParse(payload);
    if (!parsed.success) return invalidOutput();
    const analysis = buildAnalysis(sentence, parsed.data.spans);
    if (analysis) return analysis;
  }
  return invalidOutput();
};
