import { format, isValid, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

export const getFormattedKoDate = (isoString: string) => {
  const date = parseISO(isoString);
  if (!isValid(date)) throw new Error(`Invalid ISO string: ${isoString}`);
  return format(date, 'PPP(eee) p', { locale: ko });
};
