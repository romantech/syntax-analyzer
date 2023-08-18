import { useEffect, useRef } from 'react';

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
