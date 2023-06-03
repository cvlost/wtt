import React from 'react';
import { Box, List, MenuItem } from '@mui/material';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../../features/users/usersSlice';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import ContactsIcon from '@mui/icons-material/Contacts';
import { logout } from '../../../features/users/usersThunks';
import useConfirm from '../../Dialogs/Confirm/useConfirm';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import BusinessIcon from '@mui/icons-material/Business';

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { confirm } = useConfirm();

  return (
    <Box sx={{ position: 'sticky', top: 0 }}>
      <Logo />
      <List
        sx={{
          py: 0,
          color: 'azure',
          '& .MuiMenuItem-root': {
            overflow: 'hidden',
          },
          '& .MuiMenuItem-root.active': {
            bgcolor: '#2c3e50',
          },
          '& .MuiMenuItem-root.active:hover': {
            bgcolor: '#2c3e50',
          },
          '& .MuiMenuItem-root.active::before': {
            content: '""',
            position: 'absolute',
            height: '3em',
            transform: 'rotate(45deg)',
            width: '3em',
            bgcolor: 'white',
            right: '-40px',
          },
          '& .MuiMenuItem-root::before': {
            content: '""',
            position: 'absolute',
            height: '3em',
            transform: 'rotate(45deg)',
            width: '3em',
            bgcolor: 'white',
            right: '-60px',
            transition: 'right .2s',
          },
        }}
      >
        {user && (
          <MenuItem component={NavLink} to="/calendar">
            <CalendarMonthIcon sx={{ mr: 1 }} /> Calendar
          </MenuItem>
        )}
        {user && (
          <MenuItem component={NavLink} to={`/profile/${user.id}`}>
            <ContactsIcon sx={{ mr: 1 }} /> Profile
          </MenuItem>
        )}
        {user?.role === 'admin' && (
          <MenuItem component={NavLink} to="/users">
            <GroupIcon sx={{ mr: 1 }} /> Users
          </MenuItem>
        )}
        {user?.role === 'admin' && (
          <MenuItem component={NavLink} to="/schedule">
            <EventAvailableIcon sx={{ mr: 1 }} /> Schedule
          </MenuItem>
        )}
        <MenuItem component={NavLink} to="/company">
          <BusinessIcon sx={{ mr: 1 }} /> Company
        </MenuItem>
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
