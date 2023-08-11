import { Nullable } from '@/base';

export const debounce = <T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number,
) => {
  let timeoutId: Nullable<NodeJS.Timeout> = null;

  return (...args: T) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
};
