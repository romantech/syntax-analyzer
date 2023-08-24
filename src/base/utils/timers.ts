import { Nullable } from '@/base';

/**
 * Debounce a callback function by delaying its execution until a specified
 * amount of time has passed without the callback being called again.
 *
 * @param {(...args: T) => void} callback - The callback function to be debounced.
 * @param {number} delay - The delay in milliseconds before the callback is executed.
 * @template T - The type of the arguments for the callback function.
 * @returns {(...args: T) => void} - A debounced version of the original callback function.
 */
export const debounce = <T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number,
): ((...args: T) => void) => {
  let timeoutId: Nullable<NodeJS.Timeout> = null;

  return (...args: T) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
};
