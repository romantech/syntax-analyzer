import { randomUUID } from 'node:crypto';
import { logger } from '@/config/logger';
import { throwCustomError } from '@/utils/customError';
import { redis } from './redis';
import { ANALYZER_INIT_COUNTS, ANALYZER_KEY_EXP } from './redisDefaults';
import { ANALYZER_REDIS_SCHEMA } from './redisKeys';

const { FIELDS, KEYS } = ANALYZER_REDIS_SCHEMA;
const { REMAINING } = KEYS;
const { ANALYSIS, RANDOM_SENTENCE } = ANALYZER_INIT_COUNTS;
const PERIOD_FIELD = '__quota_period';

const RESERVE_QUOTA = `
local total_key, user_key, reservation_key = unpack(KEYS)
local field, cost, period_field, reservation_id, ttl = unpack(ARGV)
cost = tonumber(cost)

if redis.call('EXISTS', reservation_key) == 1 then
  return 1
end

local total = tonumber(redis.call('HGET', total_key, field))
local user = tonumber(redis.call('HGET', user_key, field))
if not total or not user or total < cost or user < cost then
  return 0
end

redis.call('HSETNX', total_key, period_field, reservation_id)
redis.call('HSETNX', user_key, period_field, reservation_id)
local total_period = redis.call('HGET', total_key, period_field)
local user_period = redis.call('HGET', user_key, period_field)
redis.call('HSET', total_key, field, total - cost)
redis.call('HSET', user_key, field, user - cost)
redis.call('SET', reservation_key, cjson.encode({total_period, user_period}), 'EX', ttl)
return 1
`;

const REFUND_QUOTA = `
local total_key, user_key, reservation_key = unpack(KEYS)
local field, cost, period_field = unpack(ARGV)
local reservation = redis.call('GET', reservation_key)
if not reservation then
  return 0
end

local periods = cjson.decode(reservation)
local total = redis.call('HMGET', total_key, period_field, field)
local user = redis.call('HMGET', user_key, period_field, field)
if total[1] == periods[1] and tonumber(total[2]) then
  redis.call('HSET', total_key, field, tonumber(total[2]) + tonumber(cost))
end
if user[1] == periods[2] and tonumber(user[2]) then
  redis.call('HSET', user_key, field, tonumber(user[2]) + tonumber(cost))
end
return redis.call('DEL', reservation_key)
`;

const READ_QUOTA = `
local total_key, user_key = unpack(KEYS)
local analysis_field, sentence_field, analysis_limit, sentence_limit, ttl = unpack(ARGV)
local total = redis.call('HMGET', total_key, analysis_field, sentence_field)
local user = redis.call('HMGET', user_key, analysis_field, sentence_field)

-- An in-flight reservation can temporarily lower the shared balance.
if total[1] and total[2] and redis.call('EXISTS', user_key) == 0 then
  redis.call('HSET', user_key, analysis_field, analysis_limit, sentence_field, sentence_limit)
  redis.call('EXPIRE', user_key, ttl)
  user = {analysis_limit, sentence_limit}
end

return {total[1], total[2], user[1], user[2]}
`;

const RESET_TOTAL_QUOTA = `
local total_key = KEYS[1]
local period_field, reset_at, analysis_field, analysis_limit, sentence_field, sentence_limit = unpack(ARGV)
local previous_reset = tonumber(redis.call('HGET', total_key, period_field))
if not previous_reset or previous_reset < tonumber(reset_at) then
  redis.call('HSET', total_key, period_field, reset_at, analysis_field, analysis_limit, sentence_field, sentence_limit)
end
`;

export const withAnalyzerQuota = async <Result>(
  clientIP: string,
  field: (typeof FIELDS)[keyof typeof FIELDS],
  cost: number,
  run: () => Promise<Result>,
): Promise<Result> => {
  const id = randomUUID();
  const keys = [
    REMAINING.TOTAL,
    REMAINING.USER(clientIP),
    REMAINING.RESERVATION(id),
  ];

  try {
    // Keep the reservation until it expires so a replay cannot debit twice.
    const reserved = await redis.eval(
      RESERVE_QUOTA,
      keys.length,
      ...keys,
      field,
      cost,
      PERIOD_FIELD,
      id,
      ANALYZER_KEY_EXP,
    );

    if (reserved === 1) return await run();
  } catch (error) {
    // A lost Redis reply can leave a reservation even if the client saw an error.
    try {
      await redis.eval(
        REFUND_QUOTA,
        keys.length,
        ...keys,
        field,
        cost,
        PERIOD_FIELD,
      );
    } catch (refundError) {
      logger.error('Failed to refund analyzer quota.', { error: refundError });
    }
    throw error;
  }

  return throwCustomError('No remaining request count available.', 400);
};

export const getAnalyzerRemainingCounts = async (clientIP: string) => {
  const [totalAnalysis, totalSentences, userAnalysis, userSentences] =
    (await redis.eval(
      READ_QUOTA,
      2,
      REMAINING.TOTAL,
      REMAINING.USER(clientIP),
      FIELDS.ANALYSIS,
      FIELDS.RANDOM_SENTENCE,
      ANALYSIS.PER_USER,
      RANDOM_SENTENCE.PER_USER,
      ANALYZER_KEY_EXP,
    )) as (string | null)[];

  const missingFields = [
    totalAnalysis === null && FIELDS.ANALYSIS,
    totalSentences === null && FIELDS.RANDOM_SENTENCE,
  ].filter(Boolean);
  if (missingFields.length) {
    throwCustomError(
      `Invalid counts for key: ${REMAINING.TOTAL}. Missing fields: ${missingFields.join(', ')}.`,
    );
  }

  return {
    analysis: Math.min(Number(totalAnalysis), Number(userAnalysis)),
    random_sentence: Math.min(Number(totalSentences), Number(userSentences)),
  };
};

export const resetAnalyzerQuota = async (fireDate: Date) => {
  await redis.eval(
    RESET_TOTAL_QUOTA,
    1,
    REMAINING.TOTAL,
    PERIOD_FIELD,
    fireDate.getTime(),
    FIELDS.ANALYSIS,
    ANALYSIS.TOTAL,
    FIELDS.RANDOM_SENTENCE,
    RANDOM_SENTENCE.TOTAL,
  );
};
