import { TAnalysis } from '@/features/syntax-editor';

const sample1: TAnalysis = {
  id: 'YW6AX-AOZb2-xYXt05xkn',
  source: 'sample',
  createdAt: '2023-05-10T23:08:08.000Z',
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
  rootSegment: {
    id: 529410173,
    begin: 0,
    end: 12,
    constituents: [],
    children: [
      {
        id: 567219034,
        begin: 0,
        end: 2,
        constituents: [
          {
            id: 193726401,
            elementId: 1,
            label: 'subject',
            abbreviation: 's',
            type: 'token',
          },
        ],
        children: [],
      },
      {
        id: 256193740,
        begin: 2,
        end: 3,
        constituents: [
          {
            id: 618302947,
            elementId: 2,
            label: 'verb',
            abbreviation: 'v',
            type: 'token',
          },
        ],
        children: [],
      },
      {
        id: 840296172,
        begin: 3,
        end: 6,
        constituents: [
          {
            id: 930176482,
            elementId: 5,
            label: 'object',
            abbreviation: 'o',
            type: 'token',
          },
        ],
        children: [],
      },
      {
        id: 918302675,
        begin: 6,
        end: 11,
        constituents: [
          {
            id: 394810275,
            elementId: 28,
            label: 'relative clause',
            abbreviation: 'rel.cl',
            type: 'clause',
          },
        ],
        children: [
          {
            id: 182034091,
            begin: 6,
            end: 7,
            constituents: [],
            children: [],
          },
          {
            id: 930127401,
            begin: 7,
            end: 8,
            constituents: [
              {
                id: 392740101,
                elementId: 2,
                label: 'verb',
                abbreviation: 'v',
                type: 'token',
              },
            ],
            children: [],
          },
          {
            id: 238470201,
            begin: 8,
            end: 11,
            constituents: [
              {
                id: 801740310,
                elementId: 5,
                label: 'object',
                abbreviation: 'o',
                type: 'token',
              },
            ],
            children: [],
          },
        ],
      },
      {
        id: 942310875,
        begin: 11,
        end: 12,
        constituents: [],
        children: [],
      },
    ],
  },
};
const sample2: TAnalysis = {
  id: 'FoG2oo3NGMpb9daQcYtOn',
  source: 'sample',
  createdAt: '2023-05-09T23:08:08.000Z',
  sentence: [
    'After',
    'a',
    'long',
    'day',
    ',',
    'a',
    'cup',
    'of',
    'tea',
    'can',
    'be',
    'quite',
    'refreshing',
    '.',
  ],
  rootSegment: {
    id: 593487261,
    begin: 0,
    end: 14,
    constituents: [],
    children: [
      {
        id: 913842761,
        begin: 0,
        end: 4,
        constituents: [
          {
            id: 137594302,
            elementId: 19,
            label: 'adverbial phrase',
            abbreviation: 'adv.phr',
            type: 'phrase',
          },
        ],
        children: [
          {
            id: 549213847,
            begin: 0,
            end: 4,
            constituents: [
              {
                id: 238492783,
                elementId: 18,
                label: 'prepositional phrase',
                abbreviation: 'prp.phr',
                type: 'phrase',
              },
            ],
            children: [],
          },
        ],
      },
      {
        id: 3512349612,
        begin: 4,
        end: 5,
        constituents: [],
        children: [],
      },
      {
        id: 238492678,
        begin: 5,
        end: 13,
        constituents: [
          {
            id: 437892461,
            elementId: 30,
            label: 'independent clause',
            abbreviation: 'ind.cl',
            type: 'clause',
          },
        ],
        children: [
          {
            id: 139857465,
            begin: 5,
            end: 9,
            constituents: [
              {
                id: 847923789,
                elementId: 1,
                label: 'subject',
                abbreviation: 's',
                type: 'token',
              },
            ],
            children: [],
          },
          {
            id: 839241576,
            begin: 9,
            end: 11,
            constituents: [
              {
                id: 489234691,
                elementId: 4,
                label: 'modal verb',
                abbreviation: 'mod.v',
                type: 'token',
              },
              {
                id: 398459218,
                elementId: 3,
                label: 'auxiliary verb',
                abbreviation: 'aux.v',
                type: 'token',
              },
            ],
            children: [],
          },
          {
            id: 3829912938,
            begin: 11,
            end: 13,
            constituents: [
              {
                elementId: 9,
                label: 'complement',
                abbreviation: 'c',
                type: 'token-group',
                id: 3125563656,
              },
            ],
            children: [],
          },
        ],
      },
      {
        id: 2123884184,
        begin: 13,
        end: 14,
        constituents: [],
        children: [],
      },
    ],
  },
};
const sample3: TAnalysis = {
  id: 'poAWpn8l7laknHPG7VLXz',
  source: 'sample',
  createdAt: '2023-05-08T23:08:08.000Z',
  sentence: [
    'Experts',
    'have',
    'identified',
    'a',
    'large',
    'number',
    'of',
    'measures',
    'that',
    'promote',
    'energy',
    'efficiency',
    '.',
  ],
  rootSegment: {
    id: 127686740,
    begin: 0,
    end: 13,
    constituents: [],
    children: [
      {
        id: 384058296,
        begin: 0,
        end: 1,
        constituents: [
          {
            id: 527684842,
            elementId: 0,
            label: 'subject',
            abbreviation: 's',
            type: 'token',
          },
        ],
        children: [],
      },
      {
        id: 894207689,
        begin: 1,
        end: 3,
        constituents: [
          {
            id: 457685589,
            elementId: 2,
            label: 'verb',
            abbreviation: 'v',
            type: 'token',
          },
          {
            id: 457685590,
            elementId: 1,
            label: 'auxiliary verb',
            abbreviation: 'aux.v',
            type: 'token',
          },
        ],
        children: [],
      },
      {
        id: 789342059,
        begin: 3,
        end: 8,
        constituents: [
          {
            id: 257684958,
            elementId: 7,
            label: 'direct object',
            abbreviation: 'd.o.',
            type: 'token',
          },
          {
            id: 527694949,
            elementId: 14,
            label: 'prepositional phrase',
            abbreviation: 'prp.phr',
            type: 'phrase',
          },
        ],
        children: [
          {
            id: 189405980,
            begin: 3,
            end: 6,
            constituents: [],
            children: [],
          },
          {
            id: 689342031,
            begin: 6,
            end: 8,
            constituents: [],
            children: [
              {
                id: 789342058,
                begin: 6,
                end: 7,
                constituents: [],
                children: [],
              },
              {
                id: 389342059,
                begin: 7,
                end: 8,
                constituents: [],
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: 794605971,
        begin: 8,
        end: 12,
        constituents: [
          {
            id: 259430970,
            elementId: 21,
            label: 'relative clause',
            abbreviation: 'rel.cl',
            type: 'clause',
          },
        ],
        children: [
          {
            id: 894305970,
            begin: 8,
            end: 9,
            constituents: [],
            children: [],
          },
          {
            id: 594305963,
            begin: 9,
            end: 10,
            constituents: [
              {
                id: 279430963,
                elementId: 8,
                label: 'verb',
                abbreviation: 'v',
                type: 'token',
              },
            ],
            children: [],
          },
          {
            id: 894305966,
            begin: 10,
            end: 12,
            constituents: [
              {
                id: 279430967,
                elementId: 17,
                label: 'direct object',
                abbreviation: 'd.o.',
                type: 'token',
              },
            ],
            children: [],
          },
        ],
      },
      {
        id: 894305972,
        begin: 12,
        end: 13,
        constituents: [],
        children: [],
      },
    ],
  },
};
const sample4: TAnalysis = {
  id: '5ykRceJ5NZwvTT5H2SXTU',
  source: 'sample',
  createdAt: '2023-05-07T23:08:08.000Z',
  sentence: [
    'Many',
    'organizations',
    'need',
    'help',
    'with',
    'administrative',
    'tasks',
    'that',
    'can',
    'be',
    'completed',
    'digitally',
    '.',
  ],
  rootSegment: {
    id: 127684630,
    begin: 0,
    end: 13,
    constituents: [],
    children: [
      {
        id: 384057216,
        begin: 0,
        end: 2,
        constituents: [
          {
            id: 527684321,
            elementId: 1,
            label: 'subject',
            abbreviation: 's',
            type: 'token',
          },
        ],
        children: [],
      },
      {
        id: 894207015,
        begin: 2,
        end: 3,
        constituents: [
          {
            id: 457684994,
            elementId: 2,
            label: 'verb',
            abbreviation: 'v',
            type: 'token',
          },
        ],
        children: [],
      },
      {
        id: 789340516,
        begin: 3,
        end: 8,
        constituents: [
          {
            id: 257684639,
            elementId: 7,
            label: 'direct object',
            abbreviation: 'd.o.',
            type: 'token',
          },
          {
            id: 527694831,
            elementId: 18,
            label: 'prepositional phrase',
            abbreviation: 'prp.phr',
            type: 'phrase',
          },
        ],
        children: [
          {
            id: 189405704,
            begin: 3,
            end: 4,
            constituents: [],
            children: [],
          },
          {
            id: 689340578,
            begin: 4,
            end: 8,
            constituents: [],
            children: [
              {
                id: 789340678,
                begin: 4,
                end: 5,
                constituents: [],
                children: [],
              },
              {
                id: 389340512,
                begin: 5,
                end: 7,
                constituents: [],
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: 794605792,
        begin: 8,
        end: 13,
        constituents: [
          {
            id: 259430793,
            elementId: 28,
            label: 'relative clause',
            abbreviation: 'rel.cl',
            type: 'clause',
          },
        ],
        children: [
          {
            id: 894305791,
            begin: 8,
            end: 9,
            constituents: [],
            children: [],
          },
          {
            id: 594305783,
            begin: 9,
            end: 11,
            constituents: [
              {
                id: 279430793,
                elementId: 4,
                label: 'modal verb',
                abbreviation: 'mod.v',
                type: 'token',
              },
              {
                id: 279430794,
                elementId: 3,
                label: 'auxiliary verb',
                abbreviation: 'aux.v',
                type: 'token',
              },
            ],
            children: [],
          },
          {
            id: 894305797,
            begin: 11,
            end: 12,
            constituents: [
              {
                id: 279430796,
                elementId: 15,
                label: 'participle',
                abbreviation: 'pt',
                type: 'token',
              },
            ],
            children: [],
          },
          {
            id: 894305795,
            begin: 12,
            end: 13,
            constituents: [],
            children: [],
          },
        ],
      },
      {
        id: 894305798,
        begin: 12,
        end: 13,
        constituents: [],
        children: [],
      },
    ],
  },
};
const sample5: TAnalysis = {
  id: 'rEo6EErtakVY5qYZNFdUA',
  source: 'sample',
  createdAt: '2023-05-06T23:08:08.000Z',
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
  rootSegment: {
    id: 398451227,
    begin: 0,
    end: 13,
    constituents: [],
    children: [
      {
        id: 125436728,
        begin: 0,
        end: 1,
        constituents: [
          {
            id: 675831002,
            elementId: 1,
            label: 'subject',
            abbreviation: 's',
            type: 'token',
          },
        ],
        children: [],
      },
      {
        id: 452972831,
        begin: 1,
        end: 2,
        constituents: [
          {
            id: 351679243,
            elementId: 2,
            label: 'verb',
            abbreviation: 'v',
            type: 'token',
          },
        ],
        children: [],
      },
      {
        id: 854372620,
        begin: 2,
        end: 9,
        constituents: [
          {
            id: 912456783,
            elementId: 5,
            label: 'object',
            abbreviation: 'o',
            type: 'token',
          },
        ],
        children: [
          {
            id: 431786520,
            begin: 2,
            end: 4,
            constituents: [],
            children: [],
          },
          {
            id: 217895346,
            begin: 4,
            end: 9,
            constituents: [
              {
                id: 671389205,
                elementId: 28,
                label: 'relative clause',
                abbreviation: 'rel.cl',
                type: 'clause',
              },
            ],
            children: [
              {
                id: 871356902,
                begin: 4,
                end: 5,
                constituents: [
                  {
                    id: 325879406,
                    elementId: 1,
                    label: 'subject',
                    abbreviation: 's',
                    type: 'token',
                  },
                ],
                children: [],
              },
              {
                id: 265348179,
                begin: 5,
                end: 6,
                constituents: [
                  {
                    id: 394587105,
                    elementId: 2,
                    label: 'verb',
                    abbreviation: 'v',
                    type: 'token',
                  },
                ],
                children: [],
              },
              {
                id: 934578210,
                begin: 6,
                end: 9,
                constituents: [
                  {
                    id: 126895435,
                    elementId: 11,
                    label: 'to-infinitive',
                    abbreviation: 't-inf',
                    type: 'token',
                  },
                ],
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: 328715692,
        begin: 9,
        end: 12,
        constituents: [
          {
            id: 781462305,
            elementId: 28,
            label: 'relative clause',
            abbreviation: 'rel.cl',
            type: 'clause',
          },
        ],
        children: [
          {
            id: 358279401,
            begin: 9,
            end: 10,
            constituents: [
              {
                id: 495367810,
                elementId: 1,
                label: 'subject',
                abbreviation: 's',
                type: 'token',
              },
            ],
            children: [],
          },
          {
            id: 128679350,
            begin: 10,
            end: 11,
            constituents: [
              {
                id: 369785241,
                elementId: 2,
                label: 'verb',
                abbreviation: 'v',
                type: 'token',
              },
            ],
            children: [],
          },
          {
            id: 751286932,
            begin: 11,
            end: 12,
            constituents: [
              {
                id: 238697254,
                elementId: 9,
                label: 'complement',
                abbreviation: 'c',
                type: 'token',
              },
            ],
            children: [],
          },
        ],
      },
      {
        id: 632871459,
        begin: 12,
        end: 13,
        constituents: [],
        children: [],
      },
    ],
  },
};

export const sampleAnalysis: TAnalysis[] = [
  sample1,
  sample2,
  sample3,
  sample4,
  sample5,
];
