import { Analysis } from '@/types/analysis.ts';
import { generateNumberID, tokenizer } from '@/utils/common.ts';
import { nanoid } from 'nanoid';

const sentences = [
  'I am a boy who likes to play tennis which is fun.',
  'Many organizations need help with administrative tasks that can be completed digitally.',
  'Experts have identified a large number of measures that promote energy efficiency.',
];
const currentSentence = sentences[1];

export const sampleData: Analysis = {
  id: nanoid(),
  sentence: tokenizer(currentSentence),
  rootSegment: {
    id: generateNumberID(),
    begin: 0,
    end: currentSentence.length,
    constituents: [],
    children: [
      {
        id: 561382940,
        begin: 0,
        end: 2,
        constituents: [
          {
            id: 724183612,
            elementId: 1,
            label: 'subject',
            abbreviation: 's',
            type: 'token',
          },
        ],
        children: [],
      },
      {
        id: 178304516,
        begin: 2,
        end: 3,
        constituents: [
          {
            id: 236842789,
            elementId: 2,
            label: 'verb',
            abbreviation: 'v',
            type: 'token',
          },
        ],
        children: [],
      },
      {
        id: 495381627,
        begin: 3,
        end: 5,
        constituents: [
          {
            id: 918237456,
            elementId: 5,
            label: 'object',
            abbreviation: 'o',
            type: 'token',
          },
        ],
        children: [],
      },
      {
        id: 867394810,
        begin: 5,
        end: 13,
        constituents: [
          {
            id: 182739485,
            elementId: 28,
            label: 'relative clause',
            abbreviation: 'rel.cl',
            type: 'clause',
          },
        ],
        children: [
          {
            id: 926358930,
            begin: 5,
            end: 6,
            constituents: [
              {
                id: 123985723,
                elementId: 5,
                label: 'object',
                abbreviation: 'o',
                type: 'token',
              },
            ],
            children: [],
          },
          {
            id: 153892740,
            begin: 6,
            end: 7,
            constituents: [],
            children: [],
          },
          {
            id: 283749293,
            begin: 7,
            end: 9,
            constituents: [
              {
                id: 237849283,
                elementId: 3,
                label: 'auxiliary verb',
                abbreviation: 'aux.v',
                type: 'token',
              },
            ],
            children: [],
          },
          {
            id: 159238740,
            begin: 9,
            end: 11,
            constituents: [
              {
                id: 102918475,
                elementId: 9,
                label: 'complement1',
                abbreviation: 'c1',
                type: 'token',
              },
              {
                id: 103938475,
                elementId: 9,
                label: 'complement2',
                abbreviation: 'c2',
                type: 'token',
              },
              {
                id: 102738475,
                elementId: 9,
                label: 'complement3',
                abbreviation: 'c3',
                type: 'token',
              },
            ],
            children: [],
          },
          {
            id: 193874920,
            begin: 11,
            end: 13,
            constituents: [],
            children: [],
          },
        ],
      },
    ],
  },
};
