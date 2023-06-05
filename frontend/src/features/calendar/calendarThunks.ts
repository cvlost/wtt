import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import { IDayReport, IDaySummary, ILoginResponse, IReport, IReportMutation, ValidationError } from '../../types';
import { isAxiosError } from 'axios';
import { setUser, unsetUser } from '../users/usersSlice';
import { AppDispatch, RootState } from '../../app/store';

export const authRetry = async <T>(request: () => Promise<T>, dispatch: AppDispatch) => {
  try {
    return await request();
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      try {
        const response = await axiosApi.get<ILoginResponse>('/users/refresh');
        dispatch(setUser(response.data));
        return await request();
      } catch (refreshError) {
        if (isAxiosError(refreshError) && refreshError.response?.status === 401) {
          dispatch(unsetUser());
        }
        throw refreshError;
      }
    }
    throw error;
  }
};

export const getAllDaysSummary = createAsyncThunk<
  IDaySummary[],
  string | void,
  { state: RootState; dispatch: AppDispatch }
>('calendar/getAllReports', async (searchParams, { dispatch }) => {
  const request = async () => {
    const response = await axiosApi.get<IDaySummary[]>(`/reports${searchParams ?? ''}`);
    return response.data;
  };

  return await authRetry<IDaySummary[]>(request, dispatch);
});

export const getOneReport = createAsyncThunk<IReport, string, { state: RootState; dispatch: AppDispatch }>(
  'calendar/getOneReport',
  async (id, { dispatch }) => {
    const request = async () => {
      const response = await axiosApi.get<IReport>(`/reports/single/${id}`);
      return response.data;
    };

    return await authRetry<IReport>(request, dispatch);
  },
);

export const createReport = createAsyncThunk<
  void,
  IReportMutation,
  { state: RootState; dispatch: AppDispatch; rejectValue: ValidationError }
>('calendar/createReport', async (report, { dispatch, rejectWithValue }) => {
  const request = async () => {
    await axiosApi.post(`/reports`, report);
  };

  try {
    return await authRetry<void>(request, dispatch);
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400)
      return rejectWithValue(e.response.data as ValidationError);

    throw e;
  }
});

export const getOneDayReport = createAsyncThunk<IDayReport, string, { state: RootState; dispatch: AppDispatch }>(
  'calendar/getAllReportsByDay',
  async (id, { dispatch }) => {
    const request = async () => {
      const response = await axiosApi.get<IDayReport>(`/reports/${id}`);
      return response.data;
    };

    return await authRetry<IDayReport>(request, dispatch);
  },
);

type UpdateParams = { report: IReportMutation; id: string };

export const updateOneReport = createAsyncThunk<
  void,
  UpdateParams,
  { state: RootState; dispatch: AppDispatch; rejectValue: ValidationError }
>('calendar/updateOneReport', async ({ id, report }, { dispatch, rejectWithValue }) => {
  const request = async () => {
    await axiosApi.patch(`/reports/${id}`, report);
  };

  try {
    return await authRetry<void>(request, dispatch);
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400)
      return rejectWithValue(e.response.data as ValidationError);

    throw e;
  }
});
