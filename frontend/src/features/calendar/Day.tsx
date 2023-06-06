import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ReportForm from './ReportForm';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectCreateReportLoading,
  selectDeleteOneReportLoading,
  selectOneDayReport,
  selectOneDayReportLoading,
  selectOneReportLoading,
  selectUpdateOneReportLoading,
  unsetOneReport,
} from './calendarSlice';
import MainPreloader from '../../components/Preloaders/MainPreloader';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs, { Dayjs } from 'dayjs';
import { deleteOneReport, getOneDayReport } from './calendarThunks';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { selectOneUser, selectUser } from '../users/usersSlice';
import { getOneUser } from '../users/usersThunks';
import { apiBaseUrl } from '../../config';
import DoneIcon from '@mui/icons-material/Done';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FlagIcon from '@mui/icons-material/Flag';
import CallMadeIcon from '@mui/icons-material/CallMade';
import { LoadingButton } from '@mui/lab';
import { getFormattedTime } from '../../utils/getFormattedTime';

const Day = () => {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const dayReport = useAppSelector(selectOneDayReport);
  const dayReportLoading = useAppSelector(selectOneDayReportLoading);
  const oneReportLoading = useAppSelector(selectOneReportLoading);
  const deleteOneReportLoading = useAppSelector(selectDeleteOneReportLoading);
  const updateOneReportLoading = useAppSelector(selectUpdateOneReportLoading);
  const createOneReportLoading = useAppSelector(selectCreateReportLoading);
  const oneUser = useAppSelector(selectOneUser);
  const location = useLocation();
  const id = useParams().id as string;
  const userId = useSearchParams()[0].get('user');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState('');
  const anyLoading = updateOneReportLoading || createOneReportLoading || dayReportLoading || oneReportLoading;

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
            <Box>
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
                  <Typography
                    fontWeight="bold"
                    fontSize="0.9em"
                  >{`${oneUser.firstName} ${oneUser.lastName}`}</Typography>
                }
                variant="outlined"
              />
              <Chip
                avatar={<AccessTimeIcon />}
                label={
                  <Typography fontWeight="bold" fontSize="0.9em">{`${getFormattedTime(
                    dayReport?.totalTime,
                  )}`}</Typography>
                }
                variant="outlined"
              />
              <Chip
                avatar={<DoneIcon />}
                label={
                  <Typography fontWeight="bold" fontSize="0.9em">{`${dayReport?.reports.length} report${
                    dayReport?.reports.length === 1 ? '' : 's'
                  }`}</Typography>
                }
                variant="outlined"
              />
            </Box>
          )}
        </Grid>
        <Grid item>
          {!userId && (
            <LoadingButton
              loading={anyLoading}
              disabled={!isAllowedDate() || anyLoading}
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => {
                setIsModalOpen(true);
                setEditId('');
              }}
            >
              Report
            </LoadingButton>
          )}
        </Grid>
      </Grid>

      <Box>
        {dayReportLoading ? (
          <MainPreloader />
        ) : dayReport?.reports?.length ? (
          <Box>
            {dayReport.reports.map((report, index) => {
              const start = dayjs(report.startedAt);
              const finish = dayjs(report.finishedAt);
              const formattedStart = start.format('HH:mm');
              const formattedFinish = finish.format('HH:mm');
              const diff = finish.diff(start);
              const formattedDiff = dayjs.duration(diff).humanize();

              return (
                <Accordion key={report.id}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight="bold">{`${index + 1}. ${report.title} (${formattedDiff})`}</Typography>
                  </AccordionSummary>
                  <Divider />
                  <AccordionActions>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item>
                        <Chip
                          avatar={<CallMadeIcon />}
                          label={
                            <Typography fontWeight="bold" fontSize="0.9em">
                              {`Started: ${formattedStart}`}
                            </Typography>
                          }
                          variant="outlined"
                        />
                        <Chip
                          avatar={<FlagIcon />}
                          label={
                            <Typography fontWeight="bold" fontSize="0.9em">
                              {`Finished: ${formattedFinish}`}
                            </Typography>
                          }
                          variant="outlined"
                        />
                        <Chip
                          avatar={<AccessTimeIcon />}
                          label={
                            <Typography fontWeight="bold" fontSize="0.9em">
                              {`Time spent: ${getFormattedTime(report.timeSpent)}`}
                            </Typography>
                          }
                          variant="outlined"
                        />
                      </Grid>
                      {report.user === user?.id && (
                        <>
                          <Grid item>
                            <Button
                              size="small"
                              onClick={() => {
                                dispatch(unsetOneReport());
                                setEditId(report.id);
                                setIsModalOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                          </Grid>
                          <Grid item>
                            <LoadingButton
                              loading={deleteOneReportLoading}
                              disabled={deleteOneReportLoading}
                              size="small"
                              color="error"
                              onClick={async () => {
                                await dispatch(deleteOneReport(report.id));
                                dispatch(getOneDayReport(id + location.search));
                              }}
                            >
                              Delete
                            </LoadingButton>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </AccordionActions>
                  <Divider />
                  <AccordionDetails>
                    <Box>
                      <Typography fontWeight="bold" fontSize=".8em" sx={{ textTransform: 'uppercase' }} mb={2}>
                        Description
                      </Typography>
                      <Box p={2} boxShadow="0 0 .5em gainsboro">
                        <Typography>{report.description}</Typography>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        ) : (
          <Alert severity="info">0 reports.</Alert>
        )}
      </Box>
      <Dialog
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      >
        <DialogContent>
          <ReportForm
            editId={editId}
            closeModal={() => {
              setIsModalOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Day;
