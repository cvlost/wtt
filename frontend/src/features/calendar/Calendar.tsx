import React, { useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box, Chip, CircularProgress, Typography } from '@mui/material';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { DayCellContentArg, DayCellMountArg } from '@fullcalendar/core';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import MainPreloader from '../../components/Preloaders/MainPreloader';
import { selectOneUser, selectOneUserLoading, unsetOneUser } from '../users/usersSlice';
import { getOneUser } from '../users/usersThunks';
import DoneIcon from '@mui/icons-material/Done';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { selectReportsSummaryList, selectReportsSummaryListLoading } from './calendarSlice';
import { getAllDaysSummary } from './calendarThunks';
import './calendar-styles.css';
import { getFormattedTime } from '../../utils/getFormattedTime';

dayjs.extend(relativeTime);
dayjs.extend(duration);

const Calendar = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const userId = useSearchParams()[0].get('user');
  const reportsSummary = useAppSelector(selectReportsSummaryList);
  const reportsSummaryLoading = useAppSelector(selectReportsSummaryListLoading);
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
    const match = reportsSummary.find((summary) => dayjs(summary.dateStr).isSame(arg.date, 'day'));
    let formattedDuration = '';

    if (match) formattedDuration = getFormattedTime(match.totalTime);

    return (
      <Box textAlign="center">
        <span>{arg.dayNumberText}</span>
        {match && (
          <>
            <Typography fontWeight="bold" fontSize="0.7rem">
              Activity:
            </Typography>
            <Chip
              variant="outlined"
              size="small"
              color="success"
              icon={<AccessTimeIcon />}
              label={formattedDuration}
              sx={{ cursor: 'pointer' }}
            />
            <Chip
              variant="outlined"
              size="small"
              color="success"
              icon={<DoneIcon />}
              label={`${match.count} report${match.count === 1 ? '' : 's'}`}
              sx={{ cursor: 'pointer' }}
            />
          </>
        )}
      </Box>
    );
  };

  useEffect(() => {
    if (userId) dispatch(getOneUser(userId));
    else dispatch(unsetOneUser());

    dispatch(getAllDaysSummary(location.search));
  }, [dispatch, location.search, userId]);

  return (
    <Box sx={{ p: 2 }}>
      {reportsSummaryLoading ? (
        <MainPreloader />
      ) : (
        <Box
          sx={{
            '& .fc-daygrid-day-frame': {
              transition: 'background .2s',
              cursor: 'pointer',
              minHeight: '8em',
            },
            '& .fc-daygrid-day-frame:hover': {
              bgcolor: '#f1f1f1',
            },
          }}
        >
          <Typography component="h1" fontSize="1em" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
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
              left: 'title',
              center: '',
              right: 'today prev,next',
            }}
            height="auto"
            dayCellContent={dayCellContent}
            dayCellDidMount={dayCellDidMount}
            weekends={false}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            dateClick={(info) => {
              navigate(`/calendar/${info.dateStr + location.search}`);
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default Calendar;
