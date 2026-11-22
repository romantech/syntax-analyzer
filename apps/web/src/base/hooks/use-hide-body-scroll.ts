import { useEffect, useRef } from 'react';

/**
 * Generates a function comment for the given function body.
 *
 * @return {void} No return value.
 */
export const useHideBodyScroll = () => {
  const originalOverflow = useRef('');

  useEffect(() => {
    originalOverflow.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow.current;
    };
  }, []);
};
