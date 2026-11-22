import { setTimeout } from 'node:timers/promises';
import { nanoid } from 'nanoid';
import type { Plugin } from 'vite';

import { generateNumberID } from '../src/base/utils/identifier.ts';
import { tokenJoiner } from '../src/base/utils/string.ts';
import {
  ANALYSIS_DECREMENT_COUNT,
  type AnalysisModel,
  DAILY_ANALYSIS_LIMIT,
  DAILY_SENTENCE_LIMIT,
  DEFAULT_PICKER_COUNT,
  MAX_PICKER_SENTENCE,
  MIN_PICKER_SENTENCE,
} from '../src/features/syntax-analyzer/constants/settings.ts';
import { RELATIVE_CLAUSE_SAMPLE } from '../src/features/syntax-editor/data/sample-analysis.ts';
import type { TAnalysis } from '../src/features/syntax-editor/types/analysis.ts';

const sampleSentences = [
  tokenJoiner(RELATIVE_CLAUSE_SAMPLE.sentence).trim(),
  'The train arrived just before sunset.',
  'She keeps a notebook beside her bed.',
  'We took the longer path through the woods.',
  'The coffee tasted better than I expected.',
];

export const mockAnalyzer = (scenario = 'success'): Plugin => ({
  name: 'mock-analyzer',
  configureServer(server) {
    const counts = {
      analysis: scenario === 'exhausted' ? 0 : DAILY_ANALYSIS_LIMIT,
      random_sentence: scenario === 'exhausted' ? 0 : DAILY_SENTENCE_LIMIT,
    };

    server.middlewares.use(async (request, response, next) => {
      const url = URL.parse(request.url ?? '/', 'http://localhost');
      const route = `${request.method} ${url?.pathname}`;
      if (
        !url ||
        ![
          'GET /api/analyzer/remaining-counts',
          'GET /api/analyzer/random-sentences',
          'POST /api/analyzer',
        ].includes(route)
      ) {
        return next();
      }

      const send = (status: number, body: unknown) => {
        response.writeHead(status, {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store',
        });
        response.end(JSON.stringify(body));
      };
      const fail = (status: number, message: string) => send(status, { status: 'error', message });

      if (scenario === 'slow') await setTimeout(1500);
      if (route === 'GET /api/analyzer/remaining-counts') return send(200, counts);
      if (scenario === 'error') return fail(500, 'Mock API error.');

      if (route === 'GET /api/analyzer/random-sentences') {
        const count = Number(url.searchParams.get('sent_count') ?? DEFAULT_PICKER_COUNT);
        if (
          !Number.isInteger(count) ||
          count < MIN_PICKER_SENTENCE ||
          count > MAX_PICKER_SENTENCE
        ) {
          return fail(400, 'Invalid sentence count.');
        }
        if (counts.random_sentence === 0) return fail(400, 'No remaining request count available.');
        counts.random_sentence -= 1;
        return send(200, sampleSentences.slice(0, count));
      }

      let payload: { model?: unknown; sentence?: unknown };
      try {
        request.setEncoding('utf8');
        let body = '';
        for await (const chunk of request.iterator({ destroyOnReturn: false })) {
          body += chunk;
          if (body.length > 8192) {
            request.resume();
            return fail(413, 'Request body is too large.');
          }
        }
        payload = JSON.parse(body) ?? {};
      } catch {
        return fail(400, 'Invalid JSON body.');
      }

      const { model, sentence } = payload;
      if (
        typeof model !== 'string' ||
        !Object.hasOwn(ANALYSIS_DECREMENT_COUNT, model) ||
        !Array.isArray(sentence) ||
        sentence.length < 2 ||
        sentence.length > 20 ||
        !sentence.every((token) => typeof token === 'string' && token.trim())
      ) {
        return fail(400, 'Invalid analysis request.');
      }

      const cost = ANALYSIS_DECREMENT_COUNT[model as AnalysisModel];
      if (counts.analysis < cost) return fail(400, 'No remaining request count available.');
      counts.analysis -= cost;

      const matchesSample =
        sentence.length === RELATIVE_CLAUSE_SAMPLE.sentence.length &&
        sentence.every((token, index) => token === RELATIVE_CLAUSE_SAMPLE.sentence[index]);
      const analysis: TAnalysis = {
        id: nanoid(),
        source: 'user',
        createdAt: new Date().toISOString(),
        sentence,
        rootSegment: matchesSample
          ? RELATIVE_CLAUSE_SAMPLE.rootSegment
          : {
              id: generateNumberID(),
              begin: 0,
              end: sentence.length,
              constituents: [],
              children: [],
            },
        isAnalyzedByGPT: true,
      };
      send(200, analysis);
    });
  },
});
