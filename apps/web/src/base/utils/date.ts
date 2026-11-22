import { format, isValid, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { ja } from 'date-fns/locale/ja';
import { ko } from 'date-fns/locale/ko';
import { zhCN } from 'date-fns/locale/zh-CN';

import type { ISODateString } from '@/base/types';
import type { Language } from '@/i18n/languages';

const DATE_LOCALES = { ko, en: enUS, ja, 'zh-Hans': zhCN } as const;

export const getFormattedDate = (isoString: ISODateString, language: Language): string => {
  const date = parseISO(isoString);
  if (!isValid(date)) throw new Error(`Invalid ISO string: ${isoString}`);
  return format(date, language === 'ko' ? 'PPP(eee) p' : 'PPPP p', {
    locale: DATE_LOCALES[language],
  });
};

/**
 * Checks if the targetDate is less than or equal to the specified offsetInSeconds ago.
 *
 * @param {ISODateString} targetDate - The target date to compare.
 * @param {number} offsetInSeconds - The offset in seconds.
 * @return {boolean} True if the targetDate is less than or equal to the offsetInSeconds ago, false otherwise.
 */
export const isLessThanAgo = (targetDate: ISODateString, offsetInSeconds: number): boolean => {
  const currentTime = Date.now();
  const targetTime = parseISO(targetDate).getTime();
  const diffInSeconds = (currentTime - targetTime) / 1000;

  return diffInSeconds <= offsetInSeconds;
};
