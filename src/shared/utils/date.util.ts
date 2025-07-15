import moment from 'moment-timezone';

export type DateData = { day: string; start: number; end: number };

export const svdate = (date = new Date()): moment.Moment => {
  return moment(date.toISOString()).tz('America/El_Salvador');
};

export const parseDateOrTime = (
  date: Date,
  type: 'date' | 'time' | 'datetime' = 'date',
): string => {
  const d = svdate(date);
  if (type === 'date') {
    return d.format('DD-MM-YYYY');
  } else if (type === 'datetime') {
    return d.format('DD-MM-YYYY HH:mm:ss');
  }
  return d.format('HH:mm:ss');
};

export const getDateData = (date: Date, subtract = 0): DateData => {
  const d = svdate(date).subtract(subtract, 'days');
  return {
    day: d.format('YYYY-MM-DD'),
    start: d.clone().startOf('day').unix(),
    end: d.clone().endOf('day').unix(),
  };
};

export const formatDate = (
  date: Date | string,
  format = 'DD/MM/YYYY',
): string => {
  return moment(date).format(format);
};

export const addDays = (date: Date, days: number): Date => {
  return moment(date).add(days, 'days').toDate();
};

export const subtractDays = (date: Date, days: number): Date => {
  return moment(date).subtract(days, 'days').toDate();
};

export const isDateBefore = (date1: Date, date2: Date): boolean => {
  return moment(date1).isBefore(moment(date2));
};

export const isDateAfter = (date1: Date, date2: Date): boolean => {
  return moment(date1).isAfter(moment(date2));
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return moment(date1).isSame(moment(date2), 'day');
};

export const getDaysDifference = (date1: Date, date2: Date): number => {
  return moment(date1).diff(moment(date2), 'days');
};

export const getStartOfDay = (date: Date): Date => {
  return moment(date).startOf('day').toDate();
};

export const getEndOfDay = (date: Date): Date => {
  return moment(date).endOf('day').toDate();
};

export const getStartOfMonth = (date: Date): Date => {
  return moment(date).startOf('month').toDate();
};

export const getEndOfMonth = (date: Date): Date => {
  return moment(date).endOf('month').toDate();
};

export const isValidDate = (date: any): boolean => {
  return moment(date).isValid();
};

export const parseISOString = (isoString: string): Date => {
  return moment(isoString).toDate();
};

export const toISOString = (date: Date): string => {
  return moment(date).toISOString();
};

export const getWeekday = (date: Date): string => {
  return moment(date).format('dddd');
};

export const getMonth = (date: Date): string => {
  return moment(date).format('MMMM');
};

export const getYear = (date: Date): number => {
  return moment(date).year();
};

export const getCurrentTimestamp = (): number => {
  return moment().unix();
};

export const timestampToDate = (timestamp: number): Date => {
  return moment.unix(timestamp).toDate();
};

export const dateToTimestamp = (date: Date): number => {
  return moment(date).unix();
};
