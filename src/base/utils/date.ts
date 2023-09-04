import { format, isValid, parseISO } from 'date-fns';
import * as locale from 'date-fns/locale';

import { ISODateString } from '@/base/types';

/**
 * Formats an ISO date string into a formatted Korean date string.
 *
 * @param {ISODateString} isoString - The ISO date string to format.
 * @return {string} The formatted Korean date string.
 */
export const getFormattedKoDate = (isoString: ISODateString): string => {
  const date = parseISO(isoString);
  if (!isValid(date)) throw new Error(`Invalid ISO string: ${isoString}`);
  return format(date, 'PPP(eee) p', { locale: locale.ko });
};

/**
 * Checks if the targetDate is less than or equal to the specified offsetInSeconds ago.
 *
 * @param {ISODateString} targetDate - The target date to compare.
 * @param {number} offsetInSeconds - The offset in seconds.
 * @return {boolean} True if the targetDate is less than or equal to the offsetInSeconds ago, false otherwise.
 */
export const isLessThanAgo = (
  targetDate: ISODateString,
  offsetInSeconds: number,
): boolean => {
  const currentTime = Date.now();
  const targetTime = parseISO(targetDate).getTime();
  const diffInSeconds = (currentTime - targetTime) / 1000;

  return diffInSeconds <= offsetInSeconds;
};
