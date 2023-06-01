import React, { useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { DayCellContentArg, DayCellMountArg } from '@fullcalendar/core';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getAllReports } from './calendarThunks';
import { selectReportsList, selectReportsListLoading } from './calendarSlice';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import MainPreloader from '../../components/Preloaders/MainPreloader';

dayjs.extend(relativeTime);
dayjs.extend(duration);

const Calendar = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const reports = useAppSelector(selectReportsList);
  const reportsLoading = useAppSelector(selectReportsListLoading);

  const dayCellDidMount = (arg: DayCellMountArg) => {
    const dayCellElement = arg.el;
    const dayTopElement = dayCellElement.querySelector('.fc-daygrid-day-top') as HTMLElement;
    if (dayTopElement) {
      dayTopElement.style.justifyContent = 'center';
    }
  };

  const dayCellContent = (arg: DayCellContentArg) => {
    const match = reports.find((report) => dayjs(report.dateStr).isSame(arg.date, 'day'));
    let totalWorkTime = '';

    if (match) {
      totalWorkTime = dayjs.duration(match.totalTime * 60_000).humanize();
    }
    return (
      <Box textAlign="center">
        <span>{arg.dayNumberText}</span>
        {match && <Typography fontWeight="bold">{totalWorkTime}</Typography>}
      </Box>
    );
  };

  useEffect(() => {
    dispatch(getAllReports(location.search));
  }, [dispatch, location.search]);

  return (
    <Box sx={{ p: 2 }}>
      {reportsLoading ? (
        <MainPreloader />
      ) : (
        <FullCalendar
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth',
          }}
          dayCellContent={dayCellContent}
          dayCellDidMount={dayCellDidMount}
          weekends={false}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={(info) => navigate(`/calendar/${info.dateStr}`)}
        />
      )}
    </Box>
  );
};

export default Calendar;
