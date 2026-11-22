import { redis } from '@/services';

export const decrementRedisCounters = async (
  keys: string[],
  fieldName: string,
  decValue: number,
) => {
  /**
   * Redis Multi 기능(트랜젝션과 유사)을 사용해 데이터의 일관성/무결성 보장.
   * 트랜젝션은 DB 작업 단위 중 하나로 일련의 연산을 하나로 묶는 것을 의미
   * 이를 통해 모든 연산이 성공적으로 이뤄져야만 전체 작업을 확정(커밋)할 수 있음
   * */
  const multi = redis.multi();
  keys.forEach((key) => {
    multi.hincrby(key, fieldName, -decValue);
  });
  await multi.exec();
};
