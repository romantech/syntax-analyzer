import { format, isValid, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ISODateString } from '@/base/types';

export const getFormattedKoDate = (isoString: ISODateString) => {
  const date = parseISO(isoString);
  if (!isValid(date)) throw new Error(`Invalid ISO string: ${isoString}`);
  return format(date, 'PPP(eee) p', { locale: ko });
};

export const isLessThanAgo = (
  targetDate: ISODateString,
  offsetInSeconds: number,
) => {
  const currentTime = Date.now();
  const targetTime = parseISO(targetDate).getTime();
  const diffInSeconds = (currentTime - targetTime) / 1000;

  return diffInSeconds <= offsetInSeconds;
};
