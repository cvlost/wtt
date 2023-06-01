import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ReportForm from './ReportForm';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectReportsByDayList, selectReportsByDayListLoading } from './calendarSlice';
import MainPreloader from '../../components/Preloaders/MainPreloader';
import { getAllReportsByDay } from './calendarThunks';

const Day = () => {
  const dispatch = useAppDispatch();
  const reports = useAppSelector(selectReportsByDayList);
  const reportsLoading = useAppSelector(selectReportsByDayListLoading);
  const id = useParams().id as string;
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllReportsByDay(id));
  }, [dispatch, id]);

  return (
    <Box p={2}>
      <Typography fontWeight="bold">one Day {id}</Typography>
      <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setIsModalOpen(true)}>
        Report
      </Button>
      <Box>
        <Typography fontWeight="bold">Reports list</Typography>
        {reportsLoading ? (
          <MainPreloader />
        ) : (
          <Box>
            {reports.map((report) => (
              <Typography key={report.id}>{report.dateStr}</Typography>
            ))}
          </Box>
        )}
      </Box>
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogContent>
          <ReportForm />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Day;
