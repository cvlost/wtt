import { createSlice } from '@reduxjs/toolkit';
import { GlobalError, IUser, ValidationError } from '../../types';
import { RootState } from '../../app/store';
import { login, register } from './usersThunks';

interface UsersState {
  user: IUser | null;
  accessToken: string;
  registerLoading: boolean;
  registerError: ValidationError | null;
  loginLoading: boolean;
  loginError: GlobalError | null;
}

const initialState: UsersState = {
  user: null,
  accessToken: '',
  registerError: null,
  registerLoading: false,
  loginError: null,
  loginLoading: false,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetAuthErrors: (state) => {
      state.registerError = null;
      state.loginError = null;
    },
    unsetUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state) => {
      state.registerError = null;
      state.registerLoading = true;
    });
    builder.addCase(register.fulfilled, (state, { payload: user }) => {
      state.user = user;
      state.registerLoading = false;
    });
    builder.addCase(register.rejected, (state, { payload: error }) => {
      state.registerError = error || null;
      state.registerLoading = false;
    });

    builder.addCase(login.pending, (state) => {
      state.loginError = null;
      state.loginLoading = true;
    });
    builder.addCase(login.fulfilled, (state, { payload: user }) => {
      state.user = user;
      state.loginLoading = false;
    });
    builder.addCase(login.rejected, (state, { payload: error }) => {
      state.loginError = error || null;
      state.loginLoading = false;
    });
  },
});

export const usersReducer = usersSlice.reducer;
export const { unsetUser, resetAuthErrors } = usersSlice.actions;

export const selectUser = (state: RootState) => state.users.user;
export const selectRegisterLoading = (state: RootState) => state.users.registerLoading;
export const selectRegisterError = (state: RootState) => state.users.registerError;
export const selectLoginLoading = (state: RootState) => state.users.loginLoading;
export const selectLoginError = (state: RootState) => state.users.loginError;
