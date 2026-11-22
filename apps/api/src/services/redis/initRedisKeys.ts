import type Redis from 'ioredis';
import { ANALYZER_INIT_COUNTS, ANALYZER_REDIS_SCHEMA } from '@/services';

const analyzerCountKeys = async (redis: Redis) => {
  const { ANALYSIS, RANDOM_SENTENCE } = ANALYZER_INIT_COUNTS;
  const { KEYS, FIELDS } = ANALYZER_REDIS_SCHEMA;

  const [analysis, randomSentence] = await redis.hmget(
    KEYS.REMAINING.TOTAL,
    FIELDS.ANALYSIS,
    FIELDS.RANDOM_SENTENCE,
  );

  const updates: Record<string, number> = {};

  if (!analysis) updates[FIELDS.ANALYSIS] = ANALYSIS.TOTAL;
  if (!randomSentence) updates[FIELDS.RANDOM_SENTENCE] = RANDOM_SENTENCE.TOTAL;

  const needsUpdate = Object.keys(updates).length;
  if (needsUpdate) return redis.hmset(KEYS.REMAINING.TOTAL, updates);
};

export const initRedisKeys = async (redis: Redis) => {
  await analyzerCountKeys(redis);
};
