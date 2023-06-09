import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  resetAuthErrors,
  selectOneUser,
  selectOneUserLoading,
  selectRegisterError,
  selectRegisterLoading,
  selectUser,
  selectUserAuthorized,
} from './usersSlice';
import { getOneUser, register, updateOneUser } from './usersThunks';
import { IRegisterMutation } from '../../types';
import FileInput from '../../components/FileInput/FileInput';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import EmailIcon from '@mui/icons-material/Email';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import KeyIcon from '@mui/icons-material/Key';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BadgeIcon from '@mui/icons-material/Badge';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import CakeIcon from '@mui/icons-material/Cake';
import { useParams } from 'react-router';
import MainPreloader from '../../components/Preloaders/MainPreloader';
import { apiBaseUrl } from '../../config';

interface Props {
  edit?: boolean;
}

const initialFields: IRegisterMutation = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  avatar: null,
  phone: '',
  employed: null,
  birthDay: null,
  position: '',
  role: '',
};

const Register: React.FC<Props> = ({ edit = false }) => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectRegisterError);
  const authorized = useAppSelector(selectUserAuthorized);
  const oneUser = useAppSelector(selectOneUser);
  const oneUserLoading = useAppSelector(selectOneUserLoading);
  const userId = useParams().id as string;
  const navigate = useNavigate();
  const registerLoading = useAppSelector(selectRegisterLoading);
  const [showPassword, setShowPassword] = React.useState(false);
  const [state, setState] = useState<IRegisterMutation>(initialFields);

  useEffect(() => {
    if (edit) {
      dispatch(getOneUser(userId));
    }
  }, [dispatch, edit, userId]);

  useEffect(() => {
    if (edit && oneUser) {
      setState({ ...oneUser, password: '', avatar: null });
    }
  }, [edit, oneUser]);

  useEffect(() => {
    return () => {
      dispatch(resetAuthErrors());
    };
  }, [dispatch]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: files && files[0] ? files[0] : null,
    }));
  };

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    edit
      ? await dispatch(updateOneUser({ id: userId, data: state })).unwrap()
      : await dispatch(register(state)).unwrap();

    user?.role === 'admin' ? navigate('/users') : navigate(`/profile/${user?.id}`);
  };

  const getFieldError = (fieldName: string) => {
    try {
      return error?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  if (!authorized) return <Navigate to="/login" />;

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar
          sx={{ m: 2, width: '70px', height: '70px', bgcolor: '#ff5b1e' }}
          src={edit && oneUser?.avatar ? `${apiBaseUrl}/${oneUser.avatar}` : undefined}
        />
        <Typography component="h1" fontSize="1em" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
          {edit ? 'Edit user account' : 'Create new account'}
        </Typography>
        {edit && oneUserLoading ? (
          <MainPreloader />
        ) : (
          <Box component="form" onSubmit={submitFormHandler} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography fontWeight="bold" fontSize="0.8em">
                  Credentials
                </Typography>
              </Grid>
              <Grid item xs={12} container alignItems="center" flexWrap="nowrap">
                <EmailIcon sx={{ mr: 1 }} />
                <TextField
                  disabled={registerLoading}
                  required
                  label="E-mail"
                  name="email"
                  autoComplete="new-email"
                  type="email"
                  value={state.email}
                  onChange={inputChangeHandler}
                  error={Boolean(getFieldError('email'))}
                  helperText={getFieldError('email')}
                />
              </Grid>
              <Grid item xs={12} container alignItems="center" flexWrap="nowrap">
                <KeyIcon sx={{ mr: 1 }} />
                <TextField
                  disabled={registerLoading}
                  label={!edit ? 'Password' : `${state.password === '' ? 'Leave Password Unchanged' : 'New Password'}`}
                  required={!edit}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={state.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position={'end'}>
                        <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  onChange={inputChangeHandler}
                  error={Boolean(getFieldError('password'))}
                  helperText={getFieldError('password')}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography fontWeight="bold" fontSize="0.8em">
                  Personal data
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FileInput
                  onChange={handleFileChange}
                  name="avatar"
                  disabled={registerLoading}
                  label={!edit ? 'Avatar' : `${state.avatar === null ? 'Leave Avatar Unchanged' : 'New Avatar'}`}
                  accept="image/*"
                />
              </Grid>
              <Grid item xs={12} container alignItems="center" flexWrap="nowrap">
                <PersonIcon sx={{ mr: 1 }} />
                <TextField
                  disabled={registerLoading}
                  required
                  label="Firstname"
                  name="firstName"
                  autoComplete="off"
                  value={state.firstName}
                  onChange={inputChangeHandler}
                  error={Boolean(getFieldError('firstName'))}
                  helperText={getFieldError('firstName')}
                />
              </Grid>
              <Grid item xs={12} container alignItems="center" flexWrap="nowrap">
                <PersonIcon sx={{ mr: 1 }} />
                <TextField
                  disabled={registerLoading}
                  required
                  label="Lastname"
                  name="lastName"
                  autoComplete="off"
                  value={state.lastName}
                  onChange={inputChangeHandler}
                  error={Boolean(getFieldError('lastName'))}
                  helperText={getFieldError('lastName')}
                />
              </Grid>
              <Grid item xs={12} container alignItems="center" flexWrap="nowrap">
                <CakeIcon sx={{ mr: 1 }} />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Birthday"
                    value={state.birthDay ? dayjs(state.birthDay) : null}
                    slotProps={{
                      textField: {
                        required: true,
                      },
                    }}
                    onChange={(newValue) => {
                      const birthDay = newValue ? newValue.toISOString() : null;
                      setState((prev) => ({ ...prev, birthDay }));
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography fontWeight="bold" fontSize="0.8em">
                  Contacts
                </Typography>
              </Grid>
              <Grid item xs={12} container alignItems="center" flexWrap="nowrap">
                <LocalPhoneIcon sx={{ mr: 1 }} />
                <TextField
                  disabled={registerLoading}
                  required
                  label="Phone number"
                  type="tel"
                  name="phone"
                  autoComplete="off"
                  value={state.phone}
                  onChange={inputChangeHandler}
                  error={Boolean(getFieldError('phone'))}
                  helperText={getFieldError('phone')}
                />
              </Grid>
              {user?.role === 'admin' && (
                <>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography fontWeight="bold" fontSize="0.8em">
                      Company
                    </Typography>
                  </Grid>
                  <Grid item xs={12} container alignItems="center" flexWrap="nowrap">
                    <WorkHistoryIcon sx={{ mr: 1 }} />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Employed at"
                        value={state.employed ? dayjs(state.employed) : null}
                        slotProps={{
                          textField: {
                            required: true,
                          },
                        }}
                        onChange={(newValue) => {
                          const employed = newValue ? newValue.toISOString() : null;
                          setState((prev) => ({ ...prev, employed }));
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} container alignItems="center" flexWrap="nowrap">
                    <BadgeIcon sx={{ mr: 1 }} />
                    <TextField
                      select
                      required
                      value={state.position}
                      name="position"
                      onChange={inputChangeHandler}
                      label="Position"
                    >
                      <MenuItem value="" disabled>
                        Select position
                      </MenuItem>
                      <MenuItem value="director">Director</MenuItem>
                      <MenuItem value="manager">Manager</MenuItem>
                      <MenuItem value="employee">Employee</MenuItem>
                    </TextField>
                  </Grid>
                  {!edit && (
                    <Grid item xs={12} container alignItems="center" flexWrap="nowrap">
                      <AdminPanelSettingsIcon sx={{ mr: 1 }} />
                      <TextField
                        select
                        required
                        value={state.role}
                        name="role"
                        onChange={inputChangeHandler}
                        label="Role"
                      >
                        <MenuItem value="" disabled>
                          Select role
                        </MenuItem>
                        <MenuItem value="admin">Administrator</MenuItem>
                        <MenuItem value="user">User</MenuItem>
                      </TextField>
                    </Grid>
                  )}
                </>
              )}
            </Grid>
            <Button
              disabled={registerLoading || oneUserLoading}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {edit ? 'Edit' : 'Create'}
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Register;
