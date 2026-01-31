export type DateLocale = 'ko' | 'en';

const toDate = (date: Date | string): Date =>
  typeof date === 'string' ? new Date(date) : date;

const toIntlLocale = (locale: DateLocale): string =>
  locale === 'ko' ? 'ko-KR' : 'en-US';

export const formatRelativeTime = (date: Date | string, locale: DateLocale = 'en'): string => {
  const diff = Date.now() - toDate(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const rtf = new Intl.RelativeTimeFormat(toIntlLocale(locale), { numeric: 'auto' });

  if (days > 0) return rtf.format(-days, 'day');
  if (hours > 0) return rtf.format(-hours, 'hour');
  if (minutes > 0) return rtf.format(-minutes, 'minute');
  return rtf.format(-seconds, 'second');
};

export const formatFullDateTime = (date: Date | string, locale: DateLocale = 'en'): string =>
  new Intl.DateTimeFormat(toIntlLocale(locale), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(toDate(date));

export const formatShortDate = (date: Date | string, locale: DateLocale = 'en'): string =>
  new Intl.DateTimeFormat(toIntlLocale(locale), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(toDate(date));

export const formatTimeOnly = (date: Date | string, locale: DateLocale = 'en'): string =>
  new Intl.DateTimeFormat(toIntlLocale(locale), {
    hour: 'numeric',
    minute: 'numeric',
  }).format(toDate(date));
