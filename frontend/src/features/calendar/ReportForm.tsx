import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUser } from '../users/usersSlice';
import { useParams } from 'react-router';
import { IReportMutation } from '../../types';
import { selectCreateReportLoading, selectOneReport, selectOneReportLoading } from './calendarSlice';
import { createReport, getAllReportsByDay, getOneReport } from './calendarThunks';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useLocation } from 'react-router-dom';

interface Props {
  editId?: string;
  closeModal: () => void;
}

const ReportForm: React.FC<Props> = ({ editId = undefined, closeModal }) => {
  const dispatch = useAppDispatch();
  const dateStr = useParams().id as string;
  const location = useLocation();
  const id = useParams().id as string;
  const user = useAppSelector(selectUser);
  const oneReport = useAppSelector(selectOneReport);
  const oneReportLoading = useAppSelector(selectOneReportLoading);
  const createLoading = useAppSelector(selectCreateReportLoading);
  const anyLoading = oneReportLoading || createLoading;
  const initialFields: IReportMutation = {
    user: user?.id,
    dateStr,
    title: '',
    description: '',
    startedAt: null,
    finishedAt: null,
  };
  const [state, setState] = useState<IReportMutation>(initialFields);

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    await dispatch(createReport(state)).unwrap();
    closeModal();
    await dispatch(getAllReportsByDay(id + location.search));
  };

  useEffect(() => {
    if (editId) dispatch(getOneReport(editId));
    if (oneReport) setState({ ...oneReport, user: user?.id });
  }, [dispatch, editId, oneReport, user?.id]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          {editId ? 'Edit report' : 'New report'}
        </Typography>
        <Box component="form" onSubmit={submitFormHandler} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                disabled={anyLoading}
                required
                label="Title"
                name="title"
                autoComplete="off"
                value={state.title}
                onChange={inputChangeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                disabled={anyLoading}
                required
                multiline
                rows={4}
                label="Description"
                name="description"
                type="text"
                autoComplete="off"
                value={state.description}
                onChange={inputChangeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  onError={() => {
                    setState((prev) => ({ ...prev, startedAt: null, finishedAt: null }));
                  }}
                  label="Started"
                  ampm={false}
                  format="HH:mm"
                  timeSteps={{ hours: 1, minutes: 1 }}
                  maxTime={state.finishedAt ? state.finishedAt : undefined}
                  value={state.startedAt}
                  onChange={(newValue) => {
                    setState((prev) => ({ ...prev, startedAt: newValue }));
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  onError={() => {
                    setState((prev) => ({ ...prev, startedAt: null, finishedAt: null }));
                  }}
                  disabled={!state.startedAt}
                  label="Finished"
                  ampm={false}
                  format="HH:mm"
                  timeSteps={{ hours: 1, minutes: 1 }}
                  minTime={state.startedAt ? state.startedAt : undefined}
                  value={state.finishedAt}
                  onChange={(newValue) => {
                    setState((prev) => ({ ...prev, finishedAt: newValue }));
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          <Button disabled={anyLoading} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {editId ? 'Update' : 'Create'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ReportForm;
