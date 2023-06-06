import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';

dayjs.extend(relativeTime);
dayjs.extend(duration);

export const getFormattedTime = (totalTime: number | undefined | null) => {
  if (!(typeof totalTime === 'number')) return '0 min';

  let formattedDuration = '';
  const totalWorkTime = dayjs.duration(totalTime, 'minutes');
  const hours = totalWorkTime.hours();
  const minutes = totalWorkTime.minutes();

  if (hours > 0) formattedDuration += `${hours} h`;
  if (formattedDuration !== '') formattedDuration += ' ';

  formattedDuration += `${minutes} min`;

  return formattedDuration;
};
