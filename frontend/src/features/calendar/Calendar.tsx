import React, { useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { DayCellContentArg, DayCellMountArg } from '@fullcalendar/core';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getAllReports } from './calendarThunks';
import { selectReportsList, selectReportsListLoading } from './calendarSlice';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import MainPreloader from '../../components/Preloaders/MainPreloader';
import { selectOneUser, selectOneUserLoading, unsetOneUser } from '../users/usersSlice';
import { getOneUser } from '../users/usersThunks';

dayjs.extend(relativeTime);
dayjs.extend(duration);

const Calendar = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const userId = useSearchParams()[0].get('user');
  const reports = useAppSelector(selectReportsList);
  const reportsLoading = useAppSelector(selectReportsListLoading);
  const oneUser = useAppSelector(selectOneUser);
  const oneUserLoading = useAppSelector(selectOneUserLoading);

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
    if (userId) dispatch(getOneUser(userId));
    else dispatch(unsetOneUser());

    dispatch(getAllReports(location.search));
  }, [dispatch, location.search, userId]);

  return (
    <Box sx={{ p: 2 }}>
      {reportsLoading ? (
        <MainPreloader />
      ) : (
        <>
          <Typography>
            {userId && oneUserLoading ? (
              <CircularProgress />
            ) : oneUser ? (
              <>{oneUser.firstName + ' ' + oneUser.lastName + "'s "} </>
            ) : (
              <>Your</>
            )}{' '}
            Activity
          </Typography>
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
            dateClick={(info) => navigate(`/calendar/${info.dateStr + location.search}`)}
          />
        </>
      )}
    </Box>
  );
};

export default Calendar;
