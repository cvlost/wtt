import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GlobalError, ILoginResponse, IUser, ValidationError } from '../../types';
import { RootState } from '../../app/store';
import { checkAuth, getOneUser, getUsersList, login, register } from './usersThunks';

interface UsersState {
  user: IUser | null;
  usersList: IUser[];
  usersListLoading: boolean;
  oneUser: IUser | null;
  oneUserLoading: boolean;
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
  usersList: [],
  usersListLoading: false,
  oneUser: null,
  oneUserLoading: false,
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
    unsetOneUser: (state) => {
      state.oneUser = null;
    },
    unsetUsersList: (state) => {
      state.usersList = [];
    },
    resetAuthErrors: (state) => {
      state.registerError = null;
      state.loginError = null;
    },
    setUser: (state, { payload }: PayloadAction<ILoginResponse>) => {
      state.user = payload.user;
      state.accessToken = payload.accessToken;
      state.authorized = true;
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

    builder.addCase(getUsersList.pending, (state) => {
      state.usersListLoading = true;
    });
    builder.addCase(getUsersList.fulfilled, (state, { payload }) => {
      state.usersList = payload;
      state.usersListLoading = false;
    });
    builder.addCase(getUsersList.rejected, (state) => {
      state.usersListLoading = false;
    });

    builder.addCase(getOneUser.pending, (state) => {
      state.oneUserLoading = true;
    });
    builder.addCase(getOneUser.fulfilled, (state, { payload }) => {
      state.oneUser = payload;
      state.oneUserLoading = false;
    });
    builder.addCase(getOneUser.rejected, (state) => {
      state.oneUserLoading = false;
    });
  },
});

export const usersReducer = usersSlice.reducer;
export const { unsetUser, resetAuthErrors, setUser, unsetUsersList, unsetOneUser } = usersSlice.actions;

export const selectUser = (state: RootState) => state.users.user;
export const selectRegisterLoading = (state: RootState) => state.users.registerLoading;
export const selectRegisterError = (state: RootState) => state.users.registerError;
export const selectLoginLoading = (state: RootState) => state.users.loginLoading;
export const selectLoginError = (state: RootState) => state.users.loginError;
export const selectUserToken = (state: RootState) => state.users.accessToken;
export const selectUserAuthorized = (state: RootState) => state.users.authorized;
export const selectUsersList = (state: RootState) => state.users.usersList;
export const selectUsersListLoading = (state: RootState) => state.users.usersListLoading;
export const selectOneUser = (state: RootState) => state.users.oneUser;
export const selectOneUserLoading = (state: RootState) => state.users.oneUserLoading;
