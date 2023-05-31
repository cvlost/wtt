import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GlobalError, ILoginResponse, IUser, ValidationError } from '../../types';
import { RootState } from '../../app/store';
import { checkAuth, login, register } from './usersThunks';

interface UsersState {
  user: IUser | null;
  accessToken: string | null;
  registerLoading: boolean;
  registerError: ValidationError | null;
  loginLoading: boolean;
  loginError: GlobalError | null;
  checkAuthLoading: boolean;
  authorized: boolean;
}

const initialState: UsersState = {
  user: null,
  accessToken: null,
  registerError: null,
  registerLoading: false,
  loginError: null,
  loginLoading: false,
  checkAuthLoading: false,
  authorized: false,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetAuthErrors: (state) => {
      state.registerError = null;
      state.loginError = null;
    },
    setUser: (state, { payload }: PayloadAction<ILoginResponse>) => {
      state.user = payload.user;
      state.accessToken = payload.accessToken;
      state.authorized = false;
    },
    unsetUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.authorized = false;
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
    builder.addCase(login.fulfilled, (state, { payload }) => {
      state.user = payload.user;
      state.accessToken = payload.accessToken;
      state.loginLoading = false;
      state.authorized = true;
    });
    builder.addCase(login.rejected, (state, { payload: error }) => {
      state.loginError = error || null;
      state.loginLoading = false;
      state.authorized = false;
    });

    builder.addCase(checkAuth.pending, (state) => {
      state.checkAuthLoading = true;
    });
    builder.addCase(checkAuth.fulfilled, (state, { payload }) => {
      state.user = payload.user;
      state.accessToken = payload.accessToken;
      state.checkAuthLoading = false;
      state.authorized = true;
    });
    builder.addCase(checkAuth.rejected, (state) => {
      state.checkAuthLoading = false;
      state.authorized = false;
    });
  },
});

export const usersReducer = usersSlice.reducer;
export const { unsetUser, resetAuthErrors, setUser } = usersSlice.actions;

export const selectUser = (state: RootState) => state.users.user;
export const selectRegisterLoading = (state: RootState) => state.users.registerLoading;
export const selectRegisterError = (state: RootState) => state.users.registerError;
export const selectLoginLoading = (state: RootState) => state.users.loginLoading;
export const selectLoginError = (state: RootState) => state.users.loginError;
export const selectUserToken = (state: RootState) => state.users.accessToken;
export const selectUserAuthorized = (state: RootState) => state.users.authorized;
