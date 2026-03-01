import { useEffect, useState } from 'react';

/**
 * Returns a boolean indicating whether the component is mounted or not.
 *
 * @return {boolean} The value indicating whether the component is mounted or not.
 */
export const useIsMounted = () => {
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    // 마운트 직후(다음 tick)에만 true로 바꿔서 "렌더 중 state 변경" ESLint 경고 대응
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => {
      clearTimeout(timer);
      setMounted(false);
    };
  }, []);

  return isMounted;
};
