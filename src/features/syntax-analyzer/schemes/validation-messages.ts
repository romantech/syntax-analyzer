import type { TFunction } from 'i18next';

import {
  MAX_SENTENCE_LENGTH,
  MAX_TOPIC_ADDITION,
  MAX_TOPIC_LENGTH,
  MIN_SENTENCE_WORDS,
  MIN_TOPIC_LENGTH,
} from '../constants';

export function translateValidationMessage(t: TFunction, message: string) {
  switch (message) {
    case 'validation.englishOnly':
      return t('validation.englishOnly');
    case 'validation.sentenceMin':
      return t('validation.sentenceMin', { limit: MIN_SENTENCE_WORDS });
    case 'validation.sentenceMax':
      return t('validation.sentenceMax', { limit: MAX_SENTENCE_LENGTH });
    case 'validation.sentenceRequired':
      return t('validation.sentenceRequired');
    case 'validation.keywordMin':
      return t('validation.keywordMin', { limit: MIN_TOPIC_LENGTH });
    case 'validation.keywordMax':
      return t('validation.keywordMax', { limit: MAX_TOPIC_LENGTH });
    case 'validation.keywordRequired':
      return t('validation.keywordRequired');
    case 'validation.topicMax':
      return t('validation.topicMax', { limit: MAX_TOPIC_ADDITION });
    case 'validation.topicDuplicate':
      return t('validation.topicDuplicate');
    default:
      return message;
  }
}
