import React, { useEffect, useState } from 'react';
import { Avatar, Box, Container, Grid, TextField, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUser } from '../users/usersSlice';
import { useParams } from 'react-router';
import { IReportMutation } from '../../types';
import {
  selectCreateReportLoading,
  selectOneReport,
  selectOneReportLoading,
  selectUpdateOneReportLoading,
} from './calendarSlice';
import { createReport, getOneDayReport, getOneReport, updateOneReport } from './calendarThunks';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useLocation } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TitleIcon from '@mui/icons-material/Title';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { MobileTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { LoadingButton } from '@mui/lab';
import FroalaEditorComponent from 'react-froala-wysiwyg';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';
import { froala } from '../../config';

interface Props {
  editId?: string;
  closeModal: () => void;
}

const ReportForm: React.FC<Props> = ({ editId = undefined, closeModal }) => {
  const updateLoading = useAppSelector(selectUpdateOneReportLoading);
  const dispatch = useAppDispatch();
  const dateStr = useParams().id as string;
  const location = useLocation();
  const id = useParams().id as string;
  const user = useAppSelector(selectUser);
  const oneReport = useAppSelector(selectOneReport);
  const oneReportLoading = useAppSelector(selectOneReportLoading);
  const createLoading = useAppSelector(selectCreateReportLoading);
  const anyLoading = oneReportLoading || createLoading || updateLoading;
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
    editId && oneReport
      ? await dispatch(
          updateOneReport({
            id: oneReport.id,
            report: state,
          }),
        ).unwrap()
      : await dispatch(createReport(state)).unwrap();

    closeModal();
    await dispatch(getOneDayReport(id + location.search));
  };

  useEffect(() => {
    if (editId) dispatch(getOneReport(editId));
  }, [dispatch, editId]);

  useEffect(() => {
    if (oneReport && editId) setState({ ...oneReport, dateStr });
  }, [dateStr, dispatch, editId, oneReport]);

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 2, width: '70px', height: '70px' }}>
          <PendingActionsIcon />
        </Avatar>
        <Typography component="h1" fontSize="1em" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
          {editId ? 'Edit report' : 'New report'}
        </Typography>
        <Box component="form" onSubmit={submitFormHandler} sx={{ mt: 3 }}>
          <Grid container spacing={2} flexDirection="column" alignItems="center">
            <Grid item container maxWidth="500px" spacing={1} flexWrap="nowrap" alignItems="center">
              <Grid item>
                <TitleIcon />
              </Grid>
              <Grid item flexGrow={1}>
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
            </Grid>
            <Grid item container maxWidth="500px" spacing={1} flexWrap="nowrap" alignItems="center">
              <Grid item>
                <AccessTimeIcon />
              </Grid>
              <Grid item>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileTimePicker
                    onError={() => {
                      setState((prev) => ({ ...prev, startedAt: null, finishedAt: null }));
                    }}
                    label="Started"
                    ampm={false}
                    format="HH:mm"
                    slotProps={{
                      textField: {
                        required: true,
                      },
                    }}
                    maxTime={state.finishedAt ? dayjs(state.finishedAt) : undefined}
                    value={state.startedAt ? dayjs(state.startedAt) : null}
                    onChange={(newValue) => {
                      const startedAt = newValue ? newValue.toISOString() : null;
                      setState((prev) => ({ ...prev, startedAt }));
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileTimePicker
                    onError={() => {
                      setState((prev) => ({ ...prev, startedAt: null, finishedAt: null }));
                    }}
                    disabled={!state.startedAt}
                    label="Finished"
                    ampm={false}
                    format="HH:mm"
                    slotProps={{
                      textField: {
                        required: true,
                      },
                    }}
                    minTime={state.startedAt ? dayjs(state.startedAt) : undefined}
                    value={state.finishedAt ? dayjs(state.finishedAt) : null}
                    onChange={(newValue) => {
                      const finishedAt = newValue ? newValue.toISOString() : null;
                      setState((prev) => ({ ...prev, finishedAt }));
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Grid item>
              <Typography fontWeight="bold" fontSize="0.8em">
                Description
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FroalaEditorComponent
                config={froala}
                model={state.description}
                onModelChange={(model: string) => setState((prev) => ({ ...prev, description: model }))}
              />
            </Grid>
          </Grid>
          <Grid item textAlign="center">
            <LoadingButton
              loading={anyLoading}
              disabled={anyLoading}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, maxWidth: '200px' }}
            >
              {editId ? 'Update' : 'Create'}
            </LoadingButton>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default ReportForm;
