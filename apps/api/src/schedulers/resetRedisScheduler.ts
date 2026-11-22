import schedule from 'node-schedule';
import { logger } from '@/config';
import { ANALYZER_INIT_COUNTS, ANALYZER_REDIS_SCHEMA, redis } from '@/services';

/** Koyeb 서버는 UTC 기준이므로 한국 시간(UTC+9) 00시는 '0 15 * * *'로 설정 */
const KST_MIDNIGHT = '0 15 * * *';

const resetAnalyzerCounts = async () => {
  const { ANALYSIS, RANDOM_SENTENCE } = ANALYZER_INIT_COUNTS;
  const { KEYS, FIELDS } = ANALYZER_REDIS_SCHEMA;

  try {
    await redis.hmset(KEYS.REMAINING.TOTAL, {
      [FIELDS.ANALYSIS]: ANALYSIS.TOTAL,
      [FIELDS.RANDOM_SENTENCE]: RANDOM_SENTENCE.TOTAL,
    });
    logger.info('Redis total count reset successfully.');
  } catch (error) {
    logger.error('Error resetting Redis total count:', error);
  }
};

export const scheduleRedisReset = () => {
  schedule.scheduleJob(KST_MIDNIGHT, resetAnalyzerCounts);
  logger.info(
    'Scheduled Redis total count reset at UTC 15:00 (KST 00:00) daily.',
  );
};
