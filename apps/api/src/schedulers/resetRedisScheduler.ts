import schedule from 'node-schedule';
import { logger } from '@/config';
import { resetAnalyzerQuota } from '@/services';

/** Koyeb 서버는 UTC 기준이므로 한국 시간(UTC+9) 00시는 '0 15 * * *'로 설정 */
const KST_MIDNIGHT = '0 15 * * *';

const resetAnalyzerCounts = async (fireDate: Date) => {
  try {
    await resetAnalyzerQuota(fireDate);
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
