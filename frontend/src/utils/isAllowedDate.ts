import dayjs, { Dayjs } from 'dayjs';

export const isAllowedDate = (dateStr: string) => {
  const today = dayjs();
  const allowedDates: Dayjs[] = [today];

  for (let i = 0; i < 2; i++) {
    let prevDay = allowedDates[i].subtract(1, 'day');
    while (prevDay.day() === 0 || prevDay.day() === 6) {
      prevDay = prevDay.subtract(1, 'day');
    }
    allowedDates.push(prevDay);
  }

  if (today.day() === 0 || today.day() === 6) allowedDates.shift();

  const allowedStr = allowedDates.map((date) => date.format('YYYY[-]MM[-]DD'));

  return allowedStr.includes(dateStr);
};
