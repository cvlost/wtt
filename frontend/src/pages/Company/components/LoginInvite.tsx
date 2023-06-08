import React from 'react';
import { Link, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../../features/users/usersSlice';

const LoginInvite = () => {
  const user = useAppSelector(selectUser);

  return (
    <>
      {user ? (
        <Typography p={1} fontWeight="bold" fontSize="0.8em" textAlign="center">
          Hello, {`${user.firstName} ${user.lastName}!`}
        </Typography>
      ) : (
        <Typography p={1} fontWeight="bold" fontSize="0.8em" textAlign="center">
          Working for the company?{' '}
          <Link component={NavLink} to="/login">
            Login
          </Link>
        </Typography>
      )}
    </>
  );
};

export default LoginInvite;
