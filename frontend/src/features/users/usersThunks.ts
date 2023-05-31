import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  GlobalError,
  IUser,
  ILoginMutation,
  IRegisterMutation,
  ILoginResponse,
  ValidationError,
  IRegisterResponse,
} from '../../types';
import axiosApi from '../../axiosApi';
import axios, { isAxiosError } from 'axios';
import { RootState } from '../../app/store';
import { setUser, unsetUser } from './usersSlice';
import { apiUrl } from '../../config';

export const register = createAsyncThunk<IUser, IRegisterMutation, { rejectValue: ValidationError }>(
  'users/register',
  async (data, { rejectWithValue, dispatch }) => {
    const request = async () => {
      const registerForm = new FormData();

      for (const [key, value] of Object.entries(data))
        if (data[key as keyof IRegisterMutation]) registerForm.append(key, value);

      const response = await axiosApi.post<IRegisterResponse>('/users/register', registerForm);
      return response.data.user;
    };

    try {
      return await request();
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400)
        return rejectWithValue(e.response.data as ValidationError);

      if (isAxiosError(e) && e.response && e.response.status === 401) {
        try {
          const response = await axios.get<ILoginResponse>(`${apiUrl}/users/refresh`, { withCredentials: true });
          dispatch(setUser(response.data));
          return await request();
        } catch (e) {
          if (isAxiosError(e) && e.response && e.response.status === 400)
            return rejectWithValue(e.response.data as ValidationError);

          if (isAxiosError(e) && e.response && e.response.status === 401) dispatch(unsetUser());

          throw e;
        }
      }

      throw e;
    }
  },
);

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
  await axiosApi.delete('/users/sessions');
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
