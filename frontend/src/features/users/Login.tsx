import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ILoginMutation } from '../../types';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { resetAuthErrors, selectLoginError, selectLoginLoading } from './usersSlice';
import { login } from './usersThunks';
import EmailIcon from '@mui/icons-material/Email';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import KeyIcon from '@mui/icons-material/Key';

const Login = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectLoginError);
  const navigate = useNavigate();
  const loginLoading = useAppSelector(selectLoginLoading);
  const [showPassword, setShowPassword] = React.useState(false);
  const [state, setState] = useState<ILoginMutation>({
    email: '',
    password: '',
  });

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
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    await dispatch(login(state)).unwrap();
    navigate('/calendar');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 2, width: '70px', height: '70px' }} />
        <Typography component="h1" fontSize="1em" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
          Sign in
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 3, width: '100%' }}>
            {error.error}
          </Alert>
        )}
        <Box component="form" onSubmit={submitFormHandler} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} container alignItems="center" flexWrap="nowrap">
              <EmailIcon sx={{ mr: 1 }} />
              <TextField
                disabled={loginLoading}
                required
                label="Email"
                name="email"
                type="email"
                autoComplete="current-email"
                value={state.email}
                onChange={inputChangeHandler}
              />
            </Grid>
            <Grid item xs={12} container alignItems="center" flexWrap="nowrap">
              <KeyIcon sx={{ mr: 1 }} />
              <TextField
                disabled={loginLoading}
                required
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={state.password}
                onChange={inputChangeHandler}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position={'end'}>
                      <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Button disabled={loginLoading} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
