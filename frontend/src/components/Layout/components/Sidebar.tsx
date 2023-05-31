import React from 'react';
import { Box, List, MenuItem } from '@mui/material';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../../features/users/usersSlice';

const Sidebar = () => {
  const user = useAppSelector(selectUser);

  return (
    <Box>
      <Logo />
      <List>
        {user && (
          <MenuItem component={NavLink} to="/calendar">
            Calendar
          </MenuItem>
        )}
        {user?.role === 'admin' && (
          <MenuItem component={NavLink} to="/users">
            Users
          </MenuItem>
        )}
        {user?.role === 'admin' && (
          <MenuItem component={NavLink} to="/register">
            register
          </MenuItem>
        )}
        <MenuItem component={NavLink} to="/login">
          login
        </MenuItem>
        <MenuItem component={NavLink} to="/logout">
          logout
        </MenuItem>
      </List>
    </Box>
  );
};

export default Sidebar;
