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
import { isAxiosError } from 'axios';
import { RootState } from '../../app/store';
import { unsetUser } from './usersSlice';

export const register = createAsyncThunk<IUser, IRegisterMutation, { rejectValue: ValidationError }>(
  'users/register',
  async (data, { rejectWithValue }) => {
    try {
      const registerForm = new FormData();

      for (const [key, value] of Object.entries(data))
        if (data[key as keyof IRegisterMutation]) registerForm.append(key, value);

      const response = await axiosApi.post<IRegisterResponse>('/users/register', registerForm);
      return response.data.user;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400)
        return rejectWithValue(e.response.data as ValidationError);

      throw e;
    }
  },
);

export const login = createAsyncThunk<IUser, ILoginMutation, { rejectValue: GlobalError }>(
  'users/login',
  async (loginMutation, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post<ILoginResponse>('/users/login', loginMutation);
      return response.data.user;
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
