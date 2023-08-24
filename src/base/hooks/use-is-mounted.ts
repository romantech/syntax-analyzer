import { useEffect, useState } from 'react';

/**
 * Returns a boolean indicating whether the component is mounted or not.
 *
 * @return {boolean} The value indicating whether the component is mounted or not.
 */
export const useIsMounted = () => {
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  return isMounted;
};
