import moment from 'moment';

/**
 *
 * @param dateTime
 * @returns true if current date is five days after last date
 */
export const checkFiveDayLimit = (dateTime: Date): boolean => {
  const currentDateTime = moment();

  return currentDateTime.diff(dateTime, 'days') > 5;
};

export const iso8601Regex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)$/;
