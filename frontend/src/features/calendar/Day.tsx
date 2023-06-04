import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Grid,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ReportForm from './ReportForm';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectOneDayReport, selectOneDayReportLoading } from './calendarSlice';
import MainPreloader from '../../components/Preloaders/MainPreloader';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs, { Dayjs } from 'dayjs';
import { getOneDayReport } from './calendarThunks';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { selectOneUser } from '../users/usersSlice';
import { getOneUser } from '../users/usersThunks';
import { apiBaseUrl } from '../../config';

dayjs.extend(relativeTime);
dayjs.extend(duration);

const Day = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const dayReport = useAppSelector(selectOneDayReport);
  const dayReportLoading = useAppSelector(selectOneDayReportLoading);
  const oneUser = useAppSelector(selectOneUser);
  const location = useLocation();
  const id = useParams().id as string;
  const userId = useSearchParams()[0].get('user');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getOneDayReport(id + location.search));
  }, [dispatch, id, location.search]);

  useEffect(() => {
    if (dayReport && userId) {
      dispatch(getOneUser(userId));
    }
  }, [dayReport, dispatch, userId]);

  const isAllowedDate = () => {
    if (!dayReport) return false;

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

    return allowedStr.includes(dayReport.dateStr);
  };

  return (
    <Box p={2}>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Grid item>
          <Box display="flex" alignItems="center" mb={2}>
            <PendingActionsIcon sx={{ mr: 1 }} />
            <Typography component="h1" fontSize="1em" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
              Reports -{' '}
              <Typography component="span" fontSize="1em" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
                {dayjs(id).format('D MMMM YYYY')}
              </Typography>
            </Typography>
          </Box>
          {oneUser && (
            <Chip
              onClick={() => navigate(`/profile/${oneUser.id}`)}
              sx={{
                '&:hover': {
                  cursor: 'pointer',
                  bgcolor: '#f3f3f3',
                },
              }}
              avatar={<Avatar alt={oneUser.firstName} src={`${apiBaseUrl}/${oneUser.avatar}`} />}
              label={
                <Typography fontWeight="bold" fontSize="0.9em">{`${oneUser.firstName} ${oneUser.lastName}`}</Typography>
              }
              variant="outlined"
            />
          )}
        </Grid>
        <Grid item>
          {!userId && (
            <Button
              disabled={!isAllowedDate()}
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setIsModalOpen(true)}
            >
              Report
            </Button>
          )}
        </Grid>
      </Grid>

      <Box>
        {dayReportLoading ? (
          <MainPreloader />
        ) : dayReport?.reports?.length ? (
          <Box>
            {dayReport.reports.map((report) => {
              const start = dayjs(report.startedAt);
              const finish = dayjs(report.finishedAt);
              const formattedStart = start.format('HH:mm');
              const formattedFinish = finish.format('HH:mm');
              const diff = finish.diff(start);
              const formattedDiff = dayjs.duration(diff).humanize();

              return (
                <Accordion key={report.id}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight="bold">{`${report.title} (${formattedDiff})`}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{`${formattedStart} - ${formattedFinish}`}</Typography>
                    <Typography>{report.description}</Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        ) : (
          <Alert severity="info">0 reports.</Alert>
        )}
      </Box>
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogContent>
          <ReportForm closeModal={() => setIsModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Day;
