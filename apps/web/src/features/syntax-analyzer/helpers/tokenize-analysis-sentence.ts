import {
  ensurePeriod,
  expandAbbreviations,
  removeThousandSeparator,
  tokenizer,
} from '../../../base/utils/string.ts';

export function tokenizeAnalysisSentence(sentence: string) {
  return tokenizer(removeThousandSeparator(expandAbbreviations(ensurePeriod(sentence.trim()))));
}
