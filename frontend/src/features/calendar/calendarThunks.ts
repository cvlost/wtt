import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import { IDayReport, ILoginResponse, IReport } from '../../types';
import { isAxiosError } from 'axios';
import { setUser, unsetUser } from '../users/usersSlice';
import { RootState } from '../../app/store';

export const getAllReports = createAsyncThunk<IDayReport[], string | void, { state: RootState }>(
  'calendar/getAllReports',
  async (searchParams, { dispatch }) => {
    const request = async () => {
      const response = await axiosApi.get<IDayReport[]>(`/reports${searchParams ?? ''}`);
      return response.data;
    };

    try {
      return await request();
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 401) {
        try {
          const response = await axiosApi.get<ILoginResponse>(`/users/refresh`);
          dispatch(setUser(response.data));
          return await request();
        } catch (e) {
          if (isAxiosError(e) && e.response && e.response.status === 401) dispatch(unsetUser());
          throw e;
        }
      }
      throw e;
    }
  },
);

export const getAllReportsByDay = createAsyncThunk<IReport[], string, { state: RootState }>(
  'calendar/getAllReportsByDay',
  async (id, { dispatch }) => {
    const request = async () => {
      const response = await axiosApi.get<IReport[]>(`/reports/${id}`);
      return response.data;
    };

    try {
      return await request();
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 401) {
        try {
          const response = await axiosApi.get<ILoginResponse>(`/users/refresh`);
          dispatch(setUser(response.data));
          return await request();
        } catch (e) {
          if (isAxiosError(e) && e.response && e.response.status === 401) dispatch(unsetUser());
          throw e;
        }
      }
      throw e;
    }
  },
);
