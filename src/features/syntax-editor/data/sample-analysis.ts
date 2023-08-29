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
        id: 3955713331,
        begin: 0,
        end: 2,
        constituents: [
          {
            elementId: 1,
            label: 'subject',
            abbreviation: 's',
            type: 'token-group',
            id: 6241171288,
          },
        ],
        children: [],
      },
      {
        id: 8814385649,
        begin: 2,
        end: 12,
        constituents: [],
        children: [
          {
            id: 8833741985,
            begin: 2,
            end: 3,
            constituents: [
              {
                elementId: 2,
                label: 'verb',
                abbreviation: 'v',
                type: 'token',
                id: 9368789536,
              },
            ],
            children: [],
          },
          {
            id: 7341258173,
            begin: 3,
            end: 12,
            constituents: [],
            children: [
              {
                id: 9228573797,
                begin: 3,
                end: 6,
                constituents: [
                  {
                    elementId: 5,
                    label: 'object',
                    abbreviation: 'o',
                    type: 'token-group',
                    id: 1656625739,
                  },
                ],
                children: [],
              },
              {
                id: 8293675411,
                begin: 6,
                end: 12,
                constituents: [],
                children: [
                  {
                    id: 6961696662,
                    begin: 6,
                    end: 12,
                    constituents: [],
                    children: [
                      {
                        id: 6761999541,
                        begin: 6,
                        end: 11,
                        constituents: [
                          {
                            elementId: 28,
                            label: 'relative clause',
                            abbreviation: 'rel.cl',
                            type: 'clause',
                            id: 4411568751,
                          },
                        ],
                        children: [
                          {
                            id: 1866225667,
                            begin: 6,
                            end: 7,
                            constituents: [],
                            children: [],
                          },
                          {
                            id: 5518759134,
                            begin: 7,
                            end: 8,
                            constituents: [
                              {
                                elementId: 2,
                                label: 'verb',
                                abbreviation: 'v',
                                type: 'token',
                                id: 8146626981,
                              },
                            ],
                            children: [],
                          },
                          {
                            id: 3567531319,
                            begin: 8,
                            end: 11,
                            constituents: [
                              {
                                elementId: 5,
                                label: 'object',
                                abbreviation: 'o',
                                type: 'token-group',
                                id: 4759744121,
                              },
                            ],
                            children: [],
                          },
                        ],
                      },
                      {
                        id: 5959619989,
                        begin: 11,
                        end: 12,
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
        id: 1837831311,
        begin: 0,
        end: 1,
        constituents: [
          {
            elementId: 1,
            label: 'subject',
            abbreviation: 's',
            type: 'token',
            id: 6124799829,
          },
        ],
        children: [],
      },
      {
        id: 5249696947,
        begin: 1,
        end: 11,
        constituents: [],
        children: [
          {
            id: 7448258977,
            begin: 1,
            end: 2,
            constituents: [
              {
                elementId: 2,
                label: 'verb',
                abbreviation: 'v',
                type: 'token',
                id: 6891841497,
              },
            ],
            children: [],
          },
          {
            id: 6362855596,
            begin: 2,
            end: 11,
            constituents: [],
            children: [
              {
                id: 2773918859,
                begin: 2,
                end: 6,
                constituents: [
                  {
                    elementId: 33,
                    label: 'infinitive phrase',
                    abbreviation: 'inf.phr',
                    type: 'phrase',
                    id: 3129243551,
                  },
                ],
                children: [
                  {
                    id: 6931832932,
                    begin: 2,
                    end: 4,
                    constituents: [
                      {
                        elementId: 11,
                        label: 'to-infinitive',
                        abbreviation: 'to-inf',
                        type: 'token-group',
                        id: 3297943294,
                      },
                    ],
                    children: [],
                  },
                  {
                    id: 8294234956,
                    begin: 4,
                    end: 6,
                    constituents: [
                      {
                        elementId: 7,
                        label: 'direct object',
                        abbreviation: 'd.o.',
                        type: 'token-group',
                        id: 7898366451,
                      },
                    ],
                    children: [],
                  },
                ],
              },
              {
                id: 8852584967,
                begin: 6,
                end: 11,
                constituents: [],
                children: [
                  {
                    id: 7535554451,
                    begin: 6,
                    end: 11,
                    constituents: [],
                    children: [
                      {
                        id: 9733329317,
                        begin: 6,
                        end: 10,
                        constituents: [
                          {
                            elementId: 18,
                            label: 'prepositional phrase',
                            abbreviation: 'prp.phr',
                            type: 'phrase',
                            id: 3855936622,
                          },
                        ],
                        children: [],
                      },
                      {
                        id: 1536925184,
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
        id: 4548518644,
        begin: 0,
        end: 2,
        constituents: [
          {
            elementId: 34,
            label: 'gerund phrase',
            abbreviation: 'g.phr',
            type: 'phrase',
            id: 2634133689,
          },
        ],
        children: [],
      },
      {
        id: 4197125268,
        begin: 2,
        end: 12,
        constituents: [],
        children: [
          {
            id: 3214413818,
            begin: 2,
            end: 3,
            constituents: [],
            children: [],
          },
          {
            id: 9724794182,
            begin: 3,
            end: 11,
            constituents: [
              {
                elementId: 28,
                label: 'relative clause',
                abbreviation: 'rel.cl',
                type: 'clause',
                id: 4551297833,
              },
            ],
            children: [
              {
                id: 4179235169,
                begin: 3,
                end: 4,
                constituents: [
                  {
                    elementId: 1,
                    label: 'subject',
                    abbreviation: 's',
                    type: 'token',
                    id: 6875983787,
                  },
                ],
                children: [],
              },
              {
                id: 4962544333,
                begin: 4,
                end: 5,
                constituents: [
                  {
                    elementId: 2,
                    label: 'verb',
                    abbreviation: 'v',
                    type: 'token',
                    id: 7837622693,
                  },
                ],
                children: [],
              },
              {
                id: 4111459822,
                begin: 5,
                end: 11,
                constituents: [
                  {
                    elementId: 5,
                    label: 'object',
                    abbreviation: 'o',
                    type: 'token-group',
                    id: 2646535766,
                  },
                ],
                children: [
                  {
                    id: 5733696648,
                    begin: 5,
                    end: 7,
                    constituents: [
                      {
                        elementId: 32,
                        label: 'noun phrase',
                        abbreviation: 'n.phr',
                        type: 'phrase',
                        id: 6141667678,
                      },
                    ],
                    children: [],
                  },
                  {
                    id: 2543867293,
                    begin: 7,
                    end: 11,
                    constituents: [
                      {
                        elementId: 17,
                        label: 'participle phrase',
                        abbreviation: 'pt.phr',
                        type: 'phrase',
                        id: 9327141612,
                      },
                    ],
                    children: [],
                  },
                ],
              },
            ],
          },
          {
            id: 5649344719,
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
        id: 2887229384,
        begin: 0,
        end: 2,
        constituents: [
          {
            elementId: 1,
            label: 'subject',
            abbreviation: 's',
            type: 'token-group',
            id: 3544337163,
          },
        ],
        children: [],
      },
      {
        id: 5945933253,
        begin: 2,
        end: 13,
        constituents: [],
        children: [
          {
            id: 5527481522,
            begin: 2,
            end: 3,
            constituents: [],
            children: [],
          },
          {
            id: 9717552617,
            begin: 3,
            end: 6,
            constituents: [
              {
                elementId: 27,
                label: 'inserted clause',
                abbreviation: 'i.cl',
                type: 'clause',
                id: 3157755541,
              },
            ],
            children: [
              {
                id: 1795475449,
                begin: 3,
                end: 4,
                constituents: [
                  {
                    elementId: 1,
                    label: 'subject',
                    abbreviation: 's',
                    type: 'token',
                    id: 5645841687,
                  },
                ],
                children: [],
              },
              {
                id: 3995967176,
                begin: 4,
                end: 6,
                constituents: [],
                children: [
                  {
                    id: 7514695611,
                    begin: 4,
                    end: 5,
                    constituents: [
                      {
                        elementId: 2,
                        label: 'verb',
                        abbreviation: 'v',
                        type: 'token',
                        id: 5973813792,
                      },
                    ],
                    children: [],
                  },
                  {
                    id: 1293822521,
                    begin: 5,
                    end: 6,
                    constituents: [
                      {
                        elementId: 9,
                        label: 'complement',
                        abbreviation: 'c',
                        type: 'token',
                        id: 4152721295,
                      },
                    ],
                    children: [],
                  },
                ],
              },
            ],
          },
          {
            id: 4934146788,
            begin: 6,
            end: 13,
            constituents: [],
            children: [
              {
                id: 7542775717,
                begin: 6,
                end: 7,
                constituents: [],
                children: [],
              },
              {
                id: 2363714957,
                begin: 7,
                end: 8,
                constituents: [
                  {
                    elementId: 2,
                    label: 'verb',
                    abbreviation: 'v',
                    type: 'token',
                    id: 9674156521,
                  },
                ],
                children: [],
              },
              {
                id: 9565281554,
                begin: 8,
                end: 13,
                constituents: [],
                children: [
                  {
                    id: 7441616856,
                    begin: 8,
                    end: 12,
                    constituents: [
                      {
                        elementId: 33,
                        label: 'infinitive phrase',
                        abbreviation: 'inf.phr',
                        type: 'phrase',
                        id: 2114356323,
                      },
                    ],
                    children: [
                      {
                        id: 9278894861,
                        begin: 8,
                        end: 10,
                        constituents: [
                          {
                            elementId: 11,
                            label: 'to-infinitive',
                            abbreviation: 'to-inf',
                            type: 'token-group',
                            id: 7259194433,
                          },
                        ],
                        children: [],
                      },
                      {
                        id: 3468776975,
                        begin: 10,
                        end: 12,
                        constituents: [
                          {
                            elementId: 7,
                            label: 'direct object',
                            abbreviation: 'd.o.',
                            type: 'token-group',
                            id: 6588366653,
                          },
                        ],
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 5431662741,
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
        id: 9573512527,
        begin: 0,
        end: 1,
        constituents: [
          {
            elementId: 1,
            label: 'subject',
            abbreviation: 's',
            type: 'token',
            id: 4738537624,
          },
        ],
        children: [],
      },
      {
        id: 3695664935,
        begin: 1,
        end: 13,
        constituents: [],
        children: [
          {
            id: 4129532594,
            begin: 1,
            end: 2,
            constituents: [
              {
                elementId: 2,
                label: 'verb',
                abbreviation: 'v',
                type: 'token',
                id: 9739148357,
              },
            ],
            children: [],
          },
          {
            id: 6762577439,
            begin: 2,
            end: 13,
            constituents: [],
            children: [
              {
                id: 3825414225,
                begin: 2,
                end: 9,
                constituents: [
                  {
                    elementId: 5,
                    label: 'object',
                    abbreviation: 'o',
                    type: 'token-group',
                    id: 5365214261,
                  },
                ],
                children: [
                  {
                    id: 5817614625,
                    begin: 2,
                    end: 4,
                    constituents: [],
                    children: [],
                  },
                  {
                    id: 1575676533,
                    begin: 4,
                    end: 9,
                    constituents: [
                      {
                        elementId: 28,
                        label: 'relative clause',
                        abbreviation: 'rel.cl',
                        type: 'clause',
                        id: 5286774568,
                      },
                    ],
                    children: [
                      {
                        id: 1928238579,
                        begin: 4,
                        end: 5,
                        constituents: [
                          {
                            elementId: 1,
                            label: 'subject',
                            abbreviation: 's',
                            type: 'token',
                            id: 1391591874,
                          },
                        ],
                        children: [],
                      },
                      {
                        id: 4291853899,
                        begin: 5,
                        end: 9,
                        constituents: [],
                        children: [
                          {
                            id: 7481731672,
                            begin: 5,
                            end: 6,
                            constituents: [
                              {
                                elementId: 2,
                                label: 'verb',
                                abbreviation: 'v',
                                type: 'token',
                                id: 1519855346,
                              },
                            ],
                            children: [],
                          },
                          {
                            id: 3434614488,
                            begin: 6,
                            end: 9,
                            constituents: [
                              {
                                elementId: 11,
                                label: 'to-infinitive',
                                abbreviation: 'to-inf',
                                type: 'token-group',
                                id: 7133237238,
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
              {
                id: 9479729352,
                begin: 9,
                end: 13,
                constituents: [],
                children: [
                  {
                    id: 5381161499,
                    begin: 9,
                    end: 12,
                    constituents: [
                      {
                        elementId: 28,
                        label: 'relative clause',
                        abbreviation: 'rel.cl',
                        type: 'clause',
                        id: 5163176187,
                      },
                    ],
                    children: [
                      {
                        id: 8774897479,
                        begin: 9,
                        end: 10,
                        constituents: [
                          {
                            elementId: 1,
                            label: 'subject',
                            abbreviation: 's',
                            type: 'token',
                            id: 6851577445,
                          },
                        ],
                        children: [],
                      },
                      {
                        id: 8939479185,
                        begin: 10,
                        end: 12,
                        constituents: [],
                        children: [
                          {
                            id: 4856997281,
                            begin: 10,
                            end: 11,
                            constituents: [
                              {
                                elementId: 2,
                                label: 'verb',
                                abbreviation: 'v',
                                type: 'token',
                                id: 5732353285,
                              },
                            ],
                            children: [],
                          },
                          {
                            id: 5563832855,
                            begin: 11,
                            end: 12,
                            constituents: [
                              {
                                elementId: 5,
                                label: 'object',
                                abbreviation: 'o',
                                type: 'token',
                                id: 4621673669,
                              },
                            ],
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: 7617815651,
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
