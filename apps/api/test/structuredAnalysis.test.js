require('module-alias/register');

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { createChatOpenAI } = require('../dist/services/openAI/openAIUtils');
const { startApp, analysisPromptValues } = require('../test-support/app');

test('serves structured basic analyses with existing quota and response fields', async (context) => {
  const sentence = ['The', 'team', 'that', 'won', 'cheered', '.'];
  const validSpans = [
    { begin: 3, end: 4, tags: ['verb'] },
    { begin: 4, end: 5, tags: ['noun phrase'] },
    { begin: 0, end: 5, tags: ['independent clause'] },
    { begin: 0, end: 4, tags: ['subject', 'subject'] },
    { begin: 4, end: 5, tags: ['verb'] },
    { begin: 0, end: 4, tags: ['noun phrase'] },
    {
      begin: 2,
      end: 4,
      tags: ['adjectival clause', 'relative clause', 'dependent clause'],
    },
  ];
  let completion;
  let retryCompletion;
  let reserves = 0;
  let refunds = 0;
  let modelCalls = 0;
  let promptReads = 0;
  let promptValues = analysisPromptValues;
  const systemMessages = [];
  const createModel = createChatOpenAI('test-key');

  const baseURL = await startApp(context, {
    models: { analysis: 'gpt-6-luna' },
    redis: {
      hmget: async (key, ...fields) => {
        assert.equal(key, 'analyzer:prompt');
        assert.deepEqual(fields, [
          'analysis_structured',
          'analysis_structured_retry',
        ]);
        promptReads++;
        return promptValues;
      },
      eval: async (_script, _keyCount, ...args) => {
        if (args.at(-1) === 1) {
          assert.equal(args.at(-2), 'analysis');
          reserves++;
        } else {
          assert.equal(args.at(-3), 'analysis');
          assert.equal(args.at(-2), 1);
          refunds++;
        }
        return 1;
      },
    },
    createModel: (config) =>
      createModel({
        ...config,
        configuration: {
          fetch: async (url, init) => {
            modelCalls++;
            const request = JSON.parse(init.body);
            assert.equal(new URL(url).pathname, '/v1/chat/completions');
            assert.equal(request.model, 'gpt-6-luna');
            assert.equal(request.reasoning_effort, 'low');
            assert.equal(request.response_format.type, 'json_schema');
            assert.equal(request.response_format.json_schema.strict, true);
            const tagEnum =
              request.response_format.json_schema.schema.properties.spans.items
                .properties.tags.items.enum;
            assert.ok(tagEnum.includes('locative complement'));
            assert.ok(tagEnum.includes('perfect auxiliary'));
            assert.deepEqual(JSON.parse(request.messages[1].content), sentence);
            assert.ok(!Object.hasOwn(request, 'temperature'));
            systemMessages.push(request.messages[0].content);
            const choice = { index: 0, finish_reason: 'stop', ...completion };
            if (retryCompletion) {
              completion = retryCompletion;
              retryCompletion = undefined;
            }
            return Response.json({
              id: 'chatcmpl-test',
              object: 'chat.completion',
              created: 1,
              model: request.model,
              choices: [choice],
            });
          },
        },
      }),
  });
  const analyze = () =>
    fetch(`${baseURL}/analyzer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'fast-ft', sentence }),
    });

  completion = {
    message: {
      role: 'assistant',
      content: JSON.stringify({ spans: validSpans }),
    },
  };
  const success = await analyze();
  assert.equal(success.status, 200);
  const analysis = await success.json();
  assert.deepEqual(analysis.sentence, sentence);
  assert.equal(analysis.source, 'user');
  assert.equal(analysis.isAnalyzedByGPT, true);
  assert.equal(new Date(analysis.createdAt).toISOString(), analysis.createdAt);
  assert.ok(analysis.id);
  assert.deepEqual(analysis.rootSegment.constituents, []);
  assert.deepEqual(
    [analysis.rootSegment.begin, analysis.rootSegment.end],
    [0, 6],
  );

  const [sentenceSpan, period] = analysis.rootSegment.children;
  assert.deepEqual(sentenceSpan.constituents, []);
  const [subject, verb] = sentenceSpan.children;
  assert.deepEqual(
    subject.constituents.map(({ elementId, type }) => [elementId, type]),
    [
      [1, 'token-group'],
      [16, 'phrase'],
    ],
  );
  assert.deepEqual(
    subject.children.map(({ begin, end }) => [begin, end]),
    [
      [0, 2],
      [2, 4],
    ],
  );
  const relative = subject.children[1];
  assert.deepEqual(
    relative.constituents.map(({ abbreviation }) => abbreviation),
    ['rel.cl'],
  );
  assert.deepEqual(
    relative.children.map(({ begin, end }) => [begin, end]),
    [
      [2, 3],
      [3, 4],
    ],
  );
  assert.deepEqual(
    verb.constituents.map(({ label, type }) => [label, type]),
    [['verb', 'token']],
  );
  assert.deepEqual([period.begin, period.end, period.constituents], [5, 6, []]);
  assert.equal(reserves, 1);
  assert.equal(refunds, 0);

  const badSpans = [
    [
      { begin: 0, end: 3, tags: ['subject'] },
      { begin: 2, end: 4, tags: ['relative clause'] },
    ],
    [{ begin: 0, end: 7, tags: ['subject'] }],
    [{ begin: 2, end: 2, tags: ['verb'] }],
    [{ begin: 0, end: 2, tags: ['unknown tag'] }],
    [{ begin: 5, end: 6, tags: ['adverb'] }],
  ];
  retryCompletion = completion;
  completion = {
    message: {
      role: 'assistant',
      content: JSON.stringify({ spans: badSpans[0] }),
    },
  };
  const recovered = await analyze();
  assert.equal(recovered.status, 200);
  await recovered.json();
  assert.equal(reserves, 2);
  assert.equal(refunds, 0);
  assert.equal(modelCalls, 3);
  assert.equal(promptReads, 2);
  assert.deepEqual(
    systemMessages.map((message) => message.split('\n\n')[0]),
    [
      analysisPromptValues[0],
      analysisPromptValues[0],
      `${analysisPromptValues.join('\n')}\nReturn at least one usable grammatical tag on a non-punctuation token range.`,
    ],
  );
  for (const message of systemMessages) {
    assert.match(message, /double-object construction/);
    assert.match(message, /tag "to staff" as "prepositional phrase"/);
    assert.match(
      message,
      /Tag "that" introducing a content clause as "conjunction"/,
    );
    assert.match(message, /Tag optional clause-level modifiers/);
    assert.match(message, /"perfect auxiliary"/);
  }

  for (const spans of badSpans) {
    completion = {
      message: { role: 'assistant', content: JSON.stringify({ spans }) },
    };
    const response = await analyze();
    assert.equal(response.status, 502);
    assert.deepEqual(await response.json(), {
      status: 'error',
      message: 'Invalid sentence analysis.',
    });
  }

  completion = {
    message: { role: 'assistant', content: null, refusal: 'Refused' },
  };
  const refusal = await analyze();
  assert.equal(refusal.status, 502);
  await refusal.json();

  completion = {
    finish_reason: 'length',
    message: {
      role: 'assistant',
      content: JSON.stringify({ spans: validSpans }),
    },
  };
  const truncated = await analyze();
  assert.equal(truncated.status, 502);
  await truncated.json();
  assert.equal(refunds, badSpans.length + 2);
  assert.equal(reserves, refunds + 2);
  assert.equal(modelCalls, reserves + 5);

  for (const spans of [
    [],
    [
      { begin: 0, end: 5, tags: ['independent clause'] },
      { begin: 0, end: 1, tags: ['noun phrase'] },
    ],
  ]) {
    const before = { modelCalls, reserves, refunds };
    const unusableCompletion = {
      message: { role: 'assistant', content: JSON.stringify({ spans }) },
    };
    completion = unusableCompletion;
    retryCompletion = {
      message: {
        role: 'assistant',
        content: JSON.stringify({ spans: validSpans }),
      },
    };
    const recovery = await analyze();
    assert.equal(recovery.status, 200);
    assert.deepEqual((await recovery.json()).sentence, sentence);
    assert.equal(modelCalls, before.modelCalls + 2);
    assert.equal(reserves, before.reserves + 1);
    assert.equal(refunds, before.refunds);

    completion = unusableCompletion;
    const failure = await analyze();
    assert.equal(failure.status, 502);
    assert.deepEqual(await failure.json(), {
      status: 'error',
      message: 'Invalid sentence analysis.',
    });
    assert.equal(modelCalls, before.modelCalls + 4);
    assert.equal(reserves, before.reserves + 2);
    assert.equal(refunds, before.refunds + 1);
  }

  const callsBeforeMissingPrompt = modelCalls;
  const refundsBeforeMissingPrompt = refunds;
  for (const values of [
    [null, analysisPromptValues[1]],
    [analysisPromptValues[0], '  '],
  ]) {
    promptValues = values;
    const missing = await analyze();
    assert.equal(missing.status, 500);
    assert.deepEqual(await missing.json(), {
      status: 'error',
      message: 'Failed to retrieve analysis prompts.',
    });
  }
  assert.equal(modelCalls, callsBeforeMissingPrompt);
  assert.equal(refunds, refundsBeforeMissingPrompt + 2);
});
