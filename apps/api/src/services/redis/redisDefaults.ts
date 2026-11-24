/** 24시간 */
export const ANALYZER_KEY_EXP = 24 * 60 * 60;

export const ANALYZER_INIT_COUNTS = {
  ANALYSIS: { TOTAL: 50, PER_USER: 10, PER_IP: 30 },
  RANDOM_SENTENCE: { TOTAL: 100, PER_USER: 20, PER_IP: 60 },
} as const;
