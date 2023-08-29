import { TAnalysis } from '@/features/syntax-editor';

const sample1: TAnalysis = {
  id: 'mLy10VtmbT_JLzCK-G5-I',
  source: 'sample',
  sentence: [
    'Global',
    'warming',
    'is',
    'a',
    'significant',
    'issue',
    'that',
    'needs',
    'our',
    'immediate',
    'attention',
    '.',
  ],
  createdAt: '2023-05-10T23:08:08.000Z',
  rootSegment: {
    id: 4865464376,
    begin: 0,
    end: 12,
    constituents: [],
    children: [
      {
        id: 5667614583,
        begin: 0,
        end: 2,
        constituents: [
          {
            elementId: 1,
            label: 'subject',
            abbreviation: 's',
            type: 'token-group',
            id: 9415162547,
          },
        ],
        children: [],
      },
      {
        id: 3395695346,
        begin: 2,
        end: 12,
        constituents: [],
        children: [
          {
            id: 4181955373,
            begin: 2,
            end: 3,
            constituents: [
              {
                elementId: 2,
                label: 'verb',
                abbreviation: 'v',
                type: 'token',
                id: 2662425966,
              },
            ],
            children: [],
          },
          {
            id: 7823161451,
            begin: 3,
            end: 12,
            constituents: [],
            children: [
              {
                id: 4992863643,
                begin: 3,
                end: 6,
                constituents: [
                  {
                    elementId: 4,
                    label: 'object',
                    abbreviation: 'o',
                    type: 'token-group',
                    id: 7485815545,
                  },
                ],
                children: [],
              },
              {
                id: 2932961534,
                begin: 6,
                end: 12,
                constituents: [],
                children: [
                  {
                    id: 3649787549,
                    begin: 6,
                    end: 11,
                    constituents: [
                      {
                        elementId: 28,
                        label: 'relative clause',
                        abbreviation: 'rel.cl',
                        type: 'clause',
                        id: 8297163438,
                      },
                    ],
                    children: [
                      {
                        id: 7514833777,
                        begin: 6,
                        end: 7,
                        constituents: [],
                        children: [],
                      },
                      {
                        id: 6619221652,
                        begin: 7,
                        end: 8,
                        constituents: [
                          {
                            elementId: 2,
                            label: 'verb',
                            abbreviation: 'v',
                            type: 'token',
                            id: 7135379971,
                          },
                        ],
                        children: [],
                      },
                      {
                        id: 6434794272,
                        begin: 8,
                        end: 11,
                        constituents: [
                          {
                            elementId: 4,
                            label: 'object',
                            abbreviation: 'o',
                            type: 'token-group',
                            id: 2798745271,
                          },
                        ],
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 8449212612,
                    begin: 11,
                    end: 12,
                    constituents: [
                      {
                        elementId: 4,
                        label: 'object',
                        abbreviation: 'o',
                        type: 'token',
                        id: 1484187479,
                      },
                    ],
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  isAnalyzedByGPT: false,
};
const sample2: TAnalysis = {
  id: '925XgvM_A2tpAw5vSc5jv',
  source: 'sample',
  sentence: [
    'She',
    'learned',
    'to',
    'play',
    'the',
    'piano',
    'at',
    'a',
    'young',
    'age',
    '.',
  ],
  createdAt: '2023-05-09T23:08:08.000Z',
  rootSegment: {
    id: 5722716962,
    begin: 0,
    end: 11,
    constituents: [],
    children: [
      {
        id: 8776534114,
        begin: 0,
        end: 1,
        constituents: [
          {
            elementId: 1,
            label: 'subject',
            abbreviation: 's',
            type: 'token',
            id: 2649578475,
          },
        ],
        children: [],
      },
      {
        id: 2627854792,
        begin: 1,
        end: 11,
        constituents: [],
        children: [
          {
            id: 1765953692,
            begin: 1,
            end: 2,
            constituents: [
              {
                elementId: 2,
                label: 'verb',
                abbreviation: 'v',
                type: 'token',
                id: 6716283875,
              },
            ],
            children: [],
          },
          {
            id: 1968414591,
            begin: 2,
            end: 11,
            constituents: [],
            children: [
              {
                id: 9514746682,
                begin: 2,
                end: 6,
                constituents: [
                  {
                    elementId: 21,
                    label: 'infinitive phrase',
                    abbreviation: 'inf.phr',
                    type: 'phrase',
                    id: 3224568742,
                  },
                ],
                children: [
                  {
                    id: 2162278679,
                    begin: 2,
                    end: 4,
                    constituents: [
                      {
                        elementId: 10,
                        label: 'to-infinitive',
                        abbreviation: 'to-inf',
                        type: 'token-group',
                        id: 2967282866,
                      },
                    ],
                    children: [],
                  },
                  {
                    id: 8862553615,
                    begin: 4,
                    end: 6,
                    constituents: [
                      {
                        elementId: 6,
                        label: 'direct object',
                        abbreviation: 'd.o.',
                        type: 'token-group',
                        id: 1181227913,
                      },
                    ],
                    children: [],
                  },
                ],
              },
              {
                id: 9517942192,
                begin: 6,
                end: 11,
                constituents: [],
                children: [
                  {
                    id: 9428524589,
                    begin: 6,
                    end: 10,
                    constituents: [
                      {
                        elementId: 15,
                        label: 'prepositional phrase',
                        abbreviation: 'prp.phr',
                        type: 'phrase',
                        id: 7927719169,
                      },
                    ],
                    children: [],
                  },
                  {
                    id: 4983968383,
                    begin: 10,
                    end: 11,
                    constituents: [],
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  isAnalyzedByGPT: false,
};
const sample3: TAnalysis = {
  id: 'N2PyhdWfx9JcJJxG-Yvqs',
  source: 'sample',
  sentence: [
    'While',
    'eating',
    ',',
    'I',
    'noticed',
    'a',
    'bird',
    'flying',
    'by',
    'the',
    'window',
    '.',
  ],
  createdAt: '2023-05-08T23:08:08.000Z',
  rootSegment: {
    id: 9136494845,
    begin: 0,
    end: 12,
    constituents: [],
    children: [
      {
        id: 3613576812,
        begin: 0,
        end: 2,
        constituents: [
          {
            elementId: 20,
            label: 'gerund phrase',
            abbreviation: 'g.phr',
            type: 'phrase',
            id: 4743266174,
          },
        ],
        children: [],
      },
      {
        id: 8554321356,
        begin: 2,
        end: 12,
        constituents: [],
        children: [
          {
            id: 3614237127,
            begin: 2,
            end: 3,
            constituents: [],
            children: [],
          },
          {
            id: 4196245659,
            begin: 3,
            end: 11,
            constituents: [
              {
                elementId: 28,
                label: 'relative clause',
                abbreviation: 'rel.cl',
                type: 'clause',
                id: 4976265783,
              },
            ],
            children: [
              {
                id: 4352664735,
                begin: 3,
                end: 4,
                constituents: [
                  {
                    elementId: 1,
                    label: 'subject',
                    abbreviation: 's',
                    type: 'token',
                    id: 3125563231,
                  },
                ],
                children: [],
              },
              {
                id: 4339229513,
                begin: 4,
                end: 5,
                constituents: [
                  {
                    elementId: 2,
                    label: 'verb',
                    abbreviation: 'v',
                    type: 'token',
                    id: 5321783116,
                  },
                ],
                children: [],
              },
              {
                id: 3473973831,
                begin: 5,
                end: 11,
                constituents: [
                  {
                    elementId: 4,
                    label: 'object',
                    abbreviation: 'o',
                    type: 'token-group',
                    id: 6746351949,
                  },
                ],
                children: [
                  {
                    id: 6623273385,
                    begin: 5,
                    end: 7,
                    constituents: [],
                    children: [],
                  },
                  {
                    id: 6761648816,
                    begin: 7,
                    end: 11,
                    constituents: [
                      {
                        elementId: 14,
                        label: 'participle phrase',
                        abbreviation: 'pt.phr',
                        type: 'phrase',
                        id: 9434458545,
                      },
                    ],
                    children: [],
                  },
                ],
              },
            ],
          },
          {
            id: 6174276882,
            begin: 11,
            end: 12,
            constituents: [],
            children: [],
          },
        ],
      },
    ],
  },
  isAnalyzedByGPT: false,
};
const sample4: TAnalysis = {
  id: 'iQhJqQHMDx_ASZEsxZu8L',
  source: 'sample',
  sentence: [
    'The',
    'dog',
    ',',
    'which',
    'is',
    'brown',
    ',',
    'loves',
    'to',
    'fetch',
    'the',
    'ball',
    '.',
  ],
  createdAt: '2023-05-07T23:08:08.000Z',
  rootSegment: {
    id: 1692817299,
    begin: 0,
    end: 13,
    constituents: [],
    children: [
      {
        id: 6222332946,
        begin: 0,
        end: 2,
        constituents: [
          {
            elementId: 1,
            label: 'subject',
            abbreviation: 's',
            type: 'token-group',
            id: 2142289486,
          },
        ],
        children: [],
      },
      {
        id: 7918894762,
        begin: 2,
        end: 13,
        constituents: [],
        children: [
          {
            id: 8972881832,
            begin: 2,
            end: 3,
            constituents: [],
            children: [],
          },
          {
            id: 9387651744,
            begin: 3,
            end: 6,
            constituents: [
              {
                elementId: 27,
                label: 'inserted clause',
                abbreviation: 'i.cl',
                type: 'clause',
                id: 4342874436,
              },
            ],
            children: [
              {
                id: 4864283415,
                begin: 3,
                end: 4,
                constituents: [
                  {
                    elementId: 1,
                    label: 'subject',
                    abbreviation: 's',
                    type: 'token',
                    id: 2553674674,
                  },
                ],
                children: [],
              },
              {
                id: 2241864371,
                begin: 4,
                end: 5,
                constituents: [
                  {
                    elementId: 2,
                    label: 'verb',
                    abbreviation: 'v',
                    type: 'token',
                    id: 2444966425,
                  },
                ],
                children: [],
              },
              {
                id: 1194396446,
                begin: 5,
                end: 6,
                constituents: [
                  {
                    elementId: 8,
                    label: 'complement',
                    abbreviation: 'c',
                    type: 'token',
                    id: 8519397229,
                  },
                ],
                children: [],
              },
            ],
          },
          {
            id: 3273393961,
            begin: 6,
            end: 13,
            constituents: [],
            children: [
              {
                id: 3218297715,
                begin: 6,
                end: 7,
                constituents: [],
                children: [],
              },
              {
                id: 5291495231,
                begin: 7,
                end: 8,
                constituents: [
                  {
                    elementId: 2,
                    label: 'verb',
                    abbreviation: 'v',
                    type: 'token',
                    id: 3556848292,
                  },
                ],
                children: [],
              },
              {
                id: 5156177498,
                begin: 8,
                end: 13,
                constituents: [],
                children: [
                  {
                    id: 1378467237,
                    begin: 8,
                    end: 12,
                    constituents: [
                      {
                        elementId: 21,
                        label: 'infinitive phrase',
                        abbreviation: 'inf.phr',
                        type: 'phrase',
                        id: 6244979963,
                      },
                    ],
                    children: [
                      {
                        id: 2263693677,
                        begin: 8,
                        end: 10,
                        constituents: [
                          {
                            elementId: 10,
                            label: 'to-infinitive',
                            abbreviation: 'to-inf',
                            type: 'token-group',
                            id: 2463519372,
                          },
                        ],
                        children: [],
                      },
                      {
                        id: 9615793496,
                        begin: 10,
                        end: 12,
                        constituents: [
                          {
                            elementId: 6,
                            label: 'direct object',
                            abbreviation: 'd.o.',
                            type: 'token-group',
                            id: 8894337422,
                          },
                        ],
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 5191794914,
                    begin: 12,
                    end: 13,
                    constituents: [],
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  isAnalyzedByGPT: false,
};
const sample5: TAnalysis = {
  id: 'nCczMprOAbZ4O9HAFGDPL',
  source: 'sample',
  sentence: [
    'I',
    'am',
    'a',
    'boy',
    'who',
    'likes',
    'to',
    'play',
    'tennis',
    'which',
    'is',
    'fun',
    '.',
  ],
  createdAt: '2023-05-06T23:08:08.000Z',
  rootSegment: {
    id: 8811343281,
    begin: 0,
    end: 13,
    constituents: [],
    children: [
      {
        id: 7743726786,
        begin: 0,
        end: 1,
        constituents: [
          {
            elementId: 1,
            label: 'subject',
            abbreviation: 's',
            type: 'token',
            id: 9166536716,
          },
        ],
        children: [],
      },
      {
        id: 1519552661,
        begin: 1,
        end: 13,
        constituents: [],
        children: [
          {
            id: 5581779679,
            begin: 1,
            end: 2,
            constituents: [
              {
                elementId: 2,
                label: 'verb',
                abbreviation: 'v',
                type: 'token',
                id: 1562933652,
              },
            ],
            children: [],
          },
          {
            id: 9246676342,
            begin: 2,
            end: 13,
            constituents: [],
            children: [
              {
                id: 3112495832,
                begin: 2,
                end: 9,
                constituents: [
                  {
                    elementId: 16,
                    label: 'noun phrase',
                    abbreviation: 'n.phr',
                    type: 'phrase',
                    id: 7225914968,
                  },
                ],
                children: [
                  {
                    id: 4791528438,
                    begin: 2,
                    end: 4,
                    constituents: [],
                    children: [],
                  },
                  {
                    id: 2835774931,
                    begin: 4,
                    end: 9,
                    constituents: [
                      {
                        elementId: 28,
                        label: 'relative clause',
                        abbreviation: 'rel.cl',
                        type: 'clause',
                        id: 6299429443,
                      },
                    ],
                    children: [
                      {
                        id: 8566799975,
                        begin: 4,
                        end: 5,
                        constituents: [
                          {
                            elementId: 1,
                            label: 'subject',
                            abbreviation: 's',
                            type: 'token',
                            id: 4895757469,
                          },
                        ],
                        children: [],
                      },
                      {
                        id: 3575434482,
                        begin: 5,
                        end: 9,
                        constituents: [],
                        children: [
                          {
                            id: 4711593475,
                            begin: 5,
                            end: 6,
                            constituents: [
                              {
                                elementId: 2,
                                label: 'verb',
                                abbreviation: 'v',
                                type: 'token',
                                id: 6447637695,
                              },
                            ],
                            children: [],
                          },
                          {
                            id: 6786455147,
                            begin: 6,
                            end: 9,
                            constituents: [
                              {
                                elementId: 21,
                                label: 'infinitive phrase',
                                abbreviation: 'inf.phr',
                                type: 'phrase',
                                id: 9598552632,
                              },
                            ],
                            children: [
                              {
                                id: 9966948978,
                                begin: 6,
                                end: 8,
                                constituents: [
                                  {
                                    elementId: 10,
                                    label: 'to-infinitive',
                                    abbreviation: 'to-inf',
                                    type: 'token-group',
                                    id: 1886388864,
                                  },
                                ],
                                children: [],
                              },
                              {
                                id: 5538999147,
                                begin: 8,
                                end: 9,
                                constituents: [
                                  {
                                    elementId: 6,
                                    label: 'direct object',
                                    abbreviation: 'd.o.',
                                    type: 'token',
                                    id: 7366954146,
                                  },
                                ],
                                children: [],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                id: 7251422854,
                begin: 9,
                end: 13,
                constituents: [],
                children: [
                  {
                    id: 8123617311,
                    begin: 9,
                    end: 12,
                    constituents: [
                      {
                        elementId: 28,
                        label: 'relative clause',
                        abbreviation: 'rel.cl',
                        type: 'clause',
                        id: 9139646812,
                      },
                    ],
                    children: [
                      {
                        id: 4994667635,
                        begin: 9,
                        end: 10,
                        constituents: [
                          {
                            elementId: 1,
                            label: 'subject',
                            abbreviation: 's',
                            type: 'token',
                            id: 4492582585,
                          },
                        ],
                        children: [],
                      },
                      {
                        id: 4561874298,
                        begin: 10,
                        end: 12,
                        constituents: [],
                        children: [
                          {
                            id: 7976946314,
                            begin: 10,
                            end: 11,
                            constituents: [
                              {
                                elementId: 2,
                                label: 'verb',
                                abbreviation: 'v',
                                type: 'token',
                                id: 7977976448,
                              },
                            ],
                            children: [],
                          },
                          {
                            id: 7445192987,
                            begin: 11,
                            end: 12,
                            constituents: [
                              {
                                elementId: 4,
                                label: 'object',
                                abbreviation: 'o',
                                type: 'token',
                                id: 8745354555,
                              },
                            ],
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: 3118983541,
                    begin: 12,
                    end: 13,
                    constituents: [],
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  isAnalyzedByGPT: false,
};

export const SAMPLE_ANALYSIS: TAnalysis[] = [
  sample1,
  sample2,
  sample3,
  sample4,
  sample5,
];
