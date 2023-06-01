import { Avatar, Box, Button, Container, Divider, Grid, MenuItem, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { resetAuthErrors, selectRegisterError, selectRegisterLoading, selectUserAuthorized } from './usersSlice';
import { register } from './usersThunks';
import { IRegisterMutation } from '../../types';
import FileInput from '../../components/FileInput/FileInput';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

const Register = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectRegisterError);
  const authorized = useAppSelector(selectUserAuthorized);
  const navigate = useNavigate();
  const registerLoading = useAppSelector(selectRegisterLoading);
  const [value, setValue] = useState<Dayjs | null>(null);
  const [state, setState] = useState<IRegisterMutation>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    avatar: null,
    phone: '',
    employed: null,
    position: '',
    role: '',
  });

  useEffect(() => {
    return () => {
      dispatch(resetAuthErrors());
    };
  }, [dispatch]);

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

    await dispatch(register({ ...state, employed: value ? value.toISOString() : null })).unwrap();
    navigate('/users');
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
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          New user registration
        </Typography>
        <Box component="form" onSubmit={submitFormHandler} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                disabled={registerLoading}
                required
                label="E-mail"
                name="email"
                autoComplete="new-email"
                value={state.email}
                onChange={inputChangeHandler}
                error={Boolean(getFieldError('email'))}
                helperText={getFieldError('email')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                disabled={registerLoading}
                required
                name="password"
                label="Password"
                type="password"
                autoComplete="new-password"
                value={state.password}
                onChange={inputChangeHandler}
                error={Boolean(getFieldError('password'))}
                helperText={getFieldError('password')}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <TextField select required value={state.role} name="role" onChange={inputChangeHandler} label="Role">
                <MenuItem value="" disabled>
                  Select role
                </MenuItem>
                <MenuItem value="admin">Administrator</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Employed at"
                  value={value}
                  onChange={(newValue) => {
                    setValue(newValue);
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <FileInput onChange={handleFileChange} name="avatar" label="Avatar" accept="image/*" />
            </Grid>
          </Grid>
          <Button disabled={registerLoading} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
