export const DAILY_ANALYSIS_LIMIT = 10;

export const MAX_TOPIC_ADDITION = 3;
export const DAILY_SENTENCE_LIMIT = 20;

export const MIN_TOPIC_LENGTH = 2;
export const MAX_TOPIC_LENGTH = 20;

export const MIN_PICKER_SENTENCE = 1;
export const MAX_PICKER_SENTENCE = 5;
export const DEFAULT_PICKER_COUNT = 3;

export const MAX_SENTENCE_LENGTH = 80;
export const MIN_SENTENCE_WORDS = 3;

/** 서버 허용값과 일치 필요 */
export enum AnalysisModel {
  PRIMARY = 'primary',
  FAST = 'fast-ft',
}

export const ANALYSIS_DECREMENT_COUNT = {
  [AnalysisModel.FAST]: 1,
  [AnalysisModel.PRIMARY]: 2,
};
