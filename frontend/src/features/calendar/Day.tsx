import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogContent,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ReportForm from './ReportForm';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectReportsByDayList, selectReportsByDayListLoading } from './calendarSlice';
import MainPreloader from '../../components/Preloaders/MainPreloader';
import { getAllReportsByDay } from './calendarThunks';
import { useLocation, useSearchParams } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';

dayjs.extend(relativeTime);
dayjs.extend(duration);

const Day = () => {
  const dispatch = useAppDispatch();
  const reports = useAppSelector(selectReportsByDayList);
  const reportsLoading = useAppSelector(selectReportsByDayListLoading);
  const location = useLocation();
  const id = useParams().id as string;
  const userId = useSearchParams()[0].get('user');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllReportsByDay(id + location.search));
  }, [dispatch, id, location.search]);

  return (
    <Box p={2}>
      <Typography fontWeight="bold">one Day {id}</Typography>
      {!userId && (
        <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setIsModalOpen(true)}>
          Report
        </Button>
      )}
      <Box>
        <Typography fontWeight="bold">Reports list</Typography>
        {reportsLoading ? (
          <MainPreloader />
        ) : (
          <Box>
            {reports.map((report) => {
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
