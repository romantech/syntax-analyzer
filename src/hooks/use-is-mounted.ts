import { useEffect, useState } from 'react';

export default function useIsMounted() {
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  return isMounted;
}
