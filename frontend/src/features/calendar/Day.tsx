import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Alert, Avatar, Box, Chip, Dialog, DialogContent, Grid, Typography } from '@mui/material';
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
import dayjs, { Dayjs } from 'dayjs';
import { deleteOneReport, getOneDayReport } from './calendarThunks';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { selectOneUser, selectUser } from '../users/usersSlice';
import { getOneUser } from '../users/usersThunks';
import { apiBaseUrl } from '../../config';
import DoneIcon from '@mui/icons-material/Done';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { LoadingButton } from '@mui/lab';
import { getFormattedTime } from '../../utils/getFormattedTime';
import useConfirm from '../../components/Dialogs/Confirm/useConfirm';
import Report from './Report';

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
  const { confirm } = useConfirm();
  const anyLoading =
    updateOneReportLoading || createOneReportLoading || dayReportLoading || oneReportLoading || deleteOneReportLoading;

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

  useEffect(() => {
    dispatch(getOneDayReport(id + location.search));
  }, [dispatch, id, location.search]);

  useEffect(() => {
    if (dayReport && userId) {
      dispatch(getOneUser(userId));
    }
  }, [dayReport, dispatch, userId]);

  const onReportEdit = (id: string) => {
    dispatch(unsetOneReport());
    setEditId(id);
    setIsModalOpen(true);
  };

  const onReportDelete = async (reportId: string) => {
    if (await confirm('Delete report', 'Do you want to delete this report?')) {
      await dispatch(deleteOneReport(reportId));
      dispatch(getOneDayReport(id + location.search));
    }
  };

  return (
    <Box p={2}>
      <Grid container justifyContent="space-between" alignItems="center">
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
            <Box mb={2}>
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
          {(!userId || userId === user?.id) && isAllowedDate() && (
            <LoadingButton
              loading={anyLoading}
              disabled={!isAllowedDate() || anyLoading}
              variant="contained"
              size="small"
              sx={{ mb: 2 }}
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
          <Box pb={8}>
            {dayReport.reports.map((report, index) => (
              <Report key={report.id} report={report} index={index} onEdit={onReportEdit} onDelete={onReportDelete} />
            ))}
          </Box>
        ) : (
          <Alert severity="info">0 reports.</Alert>
        )}
      </Box>
      <Dialog
        maxWidth={false}
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
