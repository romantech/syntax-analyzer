import { Analysis } from '@/types/analysis.ts';
import { tokenizer } from '@/utils/common.ts';

const sentences = ['I am a boy who likes to play tennis which is fun.'];
const currentSentence = sentences[0];

export const sampleData: Analysis = {
  id: '7b8c92ef935647db9b24',
  sentence: tokenizer(currentSentence),
  rootSegment: {
    id: 498734612,
    begin: 0,
    end: currentSentence.length,
    constituents: [],
    children: [
      {
        id: 132451678,
        begin: 0,
        end: 1,
        constituents: [
          {
            id: 567123498,
            label: 'subject',
            abbreviation: 's',
            type: 'token',
          },
        ],
        children: [],
      },
      {
        id: 934572134,
        begin: 1,
        end: 2,
        constituents: [
          {
            id: 291345678,
            label: 'verb',
            abbreviation: 'v',
            type: 'token',
          },
        ],
        children: [],
      },
      {
        id: 789123450,
        begin: 2,
        end: 4,
        constituents: [
          {
            id: 876912345,
            label: 'object',
            abbreviation: 'o',
            type: 'token',
          },
        ],
        children: [],
      },
      {
        id: 874512309,
        begin: 4,
        end: 9,
        constituents: [
          {
            id: 567894123,
            label: 'relative clause',
            abbreviation: 'rel.cl',
            type: 'clause',
          },
        ],
        children: [
          {
            id: 652893127,
            begin: 4,
            end: 5,
            constituents: [
              {
                id: 789123456,
                label: 'subject',
                abbreviation: 's',
                type: 'token',
              },
            ],
            children: [],
          },
          {
            id: 129384756,
            begin: 5,
            end: 6,
            constituents: [
              {
                id: 987123456,
                label: 'verb',
                abbreviation: 'v',
                type: 'token',
              },
            ],
            children: [],
          },
          {
            id: 192837465,
            begin: 6,
            end: 9,
            constituents: [
              {
                id: 891234567,
                label: 'to-infinitive',
                abbreviation: 't-inf',
                type: 'phrase',
              },
            ],
            children: [],
          },
        ],
      },
      {
        id: 384756123,
        begin: 9,
        end: 12,
        constituents: [
          {
            id: 675123489,
            label: 'relative clause',
            abbreviation: 'rel.cl',
            type: 'clause',
          },
        ],
        children: [
          {
            id: 928374561,
            begin: 9,
            end: 10,
            constituents: [],
            children: [],
          },
          {
            id: 562839174,
            begin: 10,
            end: 11,
            constituents: [
              {
                id: 812345678,
                label: 'verb',
                abbreviation: 'v',
                type: 'token',
              },
            ],
            children: [],
          },
          {
            id: 293847561,
            begin: 11,
            end: 12,
            constituents: [
              {
                id: 123456789,
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
        id: 127845693,
        begin: 12,
        end: 13,
        constituents: [],
        children: [],
      },
    ],
  },
};
