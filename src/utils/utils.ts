/**
 *
 * @param dateTime
 * @returns true if current date is five days after last date
 */
export const isFiveDaysAfter = (dateTime: Date): boolean => {
  const currentDateTime = new Date();
  const fiveDaysInMillis = 5 * 24 * 60 * 60 * 1000; // Convert 5 days to milliseconds

  return currentDateTime.getTime() - dateTime.getTime() > fiveDaysInMillis;
};

export const addDays = (date: Date, days: number): Date => {
  date.setDate(date.getDate() + days);
  return date;
};

export const iso8601Regex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)$/;
