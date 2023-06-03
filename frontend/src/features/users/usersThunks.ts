import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  GlobalError,
  ILoginMutation,
  ILoginResponse,
  IRegisterMutation,
  IRegisterResponse,
  IUser,
  ValidationError,
} from '../../types';
import axiosApi from '../../axiosApi';
import axios, { isAxiosError } from 'axios';
import { AppDispatch, RootState } from '../../app/store';
import { unsetUser } from './usersSlice';
import { apiUrl } from '../../config';
import { authRetry } from '../calendar/calendarThunks';

export const register = createAsyncThunk<
  void,
  IRegisterMutation,
  { rejectValue: ValidationError; dispatch: AppDispatch }
>('users/register', async (data, { rejectWithValue, dispatch }) => {
  const request = async () => {
    const registerForm = new FormData();

    for (const [key, value] of Object.entries(data))
      if (data[key as keyof IRegisterMutation]) registerForm.append(key, value);

    await axiosApi.post<IRegisterResponse>('/users/register', registerForm);
  };

  try {
    return await authRetry<void>(request, dispatch);
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400)
      return rejectWithValue(e.response.data as ValidationError);

    throw e;
  }
});

export const login = createAsyncThunk<ILoginResponse, ILoginMutation, { rejectValue: GlobalError }>(
  'users/login',
  async (loginMutation, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post<ILoginResponse>('/users/login', loginMutation);
      return response.data;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400)
        return rejectWithValue(e.response.data as GlobalError);

      throw e;
    }
  },
);

export const logout = createAsyncThunk<void, void, { state: RootState }>('users/logout', async (_, { dispatch }) => {
  dispatch(unsetUser());
  await axiosApi.delete('/users/logout');
});

export const checkAuth = createAsyncThunk<ILoginResponse, void, { state: RootState; rejectValue: GlobalError }>(
  'users/checkAuth',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get<ILoginResponse>(`${apiUrl}/users/refresh`, { withCredentials: true });
      return response.data;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 401) {
        dispatch(unsetUser());
        return rejectWithValue(e.response.data as GlobalError);
      }

      throw e;
    }
  },
);

export const getUsersList = createAsyncThunk<IUser[], void, { state: RootState; dispatch: AppDispatch }>(
  'users/getUsersList',
  async (_, { dispatch }) => {
    const request = async () => {
      const response = await axiosApi.get<IUser[]>(`/users`);
      return response.data;
    };

    return await authRetry<IUser[]>(request, dispatch);
  },
);

export const getOneUser = createAsyncThunk<IUser, string, { state: RootState; dispatch: AppDispatch }>(
  'users/getOneUser',
  async (id, { dispatch }) => {
    const request = async () => {
      const response = await axiosApi.get<IUser>(`/users/${id}`);
      return response.data;
    };

    return await authRetry<IUser>(request, dispatch);
  },
);
