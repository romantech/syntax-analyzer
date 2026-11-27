import {
  ensurePeriod,
  expandAbbreviations,
  removeThousandSeparator,
  tokenizer,
} from '@/base/utils/string';

export function tokenizeAnalysisSentence(sentence: string) {
  return tokenizer(removeThousandSeparator(expandAbbreviations(ensurePeriod(sentence.trim()))));
}
