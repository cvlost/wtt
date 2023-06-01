import React from 'react';
import { Box, List, MenuItem } from '@mui/material';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../../features/users/usersSlice';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupIcon from '@mui/icons-material/Group';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import ContactsIcon from '@mui/icons-material/Contacts';
import { logout } from '../../../features/users/usersThunks';
import useConfirm from '../../Dialogs/Confirm/useConfirm';

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { confirm } = useConfirm();

  return (
    <Box sx={{ position: 'sticky', top: 0 }}>
      <Logo />
      <List>
        {user && (
          <MenuItem component={NavLink} to="/calendar">
            <CalendarMonthIcon sx={{ mr: 1 }} /> Calendar
          </MenuItem>
        )}
        {user && (
          <MenuItem component={NavLink} to="/profile">
            <ContactsIcon sx={{ mr: 1 }} /> Profile
          </MenuItem>
        )}
        {user?.role === 'admin' && (
          <MenuItem component={NavLink} to="/users">
            <GroupIcon sx={{ mr: 1 }} /> Users
          </MenuItem>
        )}
        {user?.role === 'admin' && (
          <MenuItem component={NavLink} to="/register">
            <GroupAddIcon sx={{ mr: 1 }} /> register
          </MenuItem>
        )}
        {!user && (
          <MenuItem component={NavLink} to="/login">
            <LoginIcon sx={{ mr: 1 }} /> Login
          </MenuItem>
        )}
        {user && (
          <MenuItem
            onClick={async () => {
              if (await confirm('Logout', 'Are you sure you want to leave?')) {
                dispatch(logout());
              }
            }}
          >
            <LogoutIcon sx={{ mr: 1 }} /> Logout
          </MenuItem>
        )}
      </List>
    </Box>
  );
};

export default Sidebar;
