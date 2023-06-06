import React from 'react';
import { Box, List, MenuItem, useMediaQuery } from '@mui/material';
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
import BusinessIcon from '@mui/icons-material/Business';
import theme from '../../../theme';

interface Props {
  onClick?: () => void;
}

const Sidebar: React.FC<Props> = ({ onClick = undefined }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { confirm } = useConfirm();
  const mdMediaQuery = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box sx={{ position: 'sticky', top: 0 }}>
      <Logo onClick={onClick} />
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
            bgcolor: '#f3f3f3',
            right: '-40px',
          },
          '& .MuiMenuItem-root::before': {
            content: '""',
            position: 'absolute',
            height: '3em',
            transform: 'rotate(45deg)',
            width: '3em',
            bgcolor: '#f3f3f3',
            right: '-60px',
            transition: 'right .2s',
            display: mdMediaQuery ? 'block' : 'none',
          },
        }}
      >
        {user && (
          <MenuItem component={NavLink} to="/calendar" onClick={onClick}>
            <CalendarMonthIcon sx={{ mr: 1 }} /> Calendar
          </MenuItem>
        )}
        {user && (
          <MenuItem component={NavLink} to={`/profile/${user.id}`} onClick={onClick}>
            <ContactsIcon sx={{ mr: 1 }} /> Profile
          </MenuItem>
        )}
        {user?.role === 'admin' && (
          <MenuItem component={NavLink} to="/users" onClick={onClick}>
            <GroupIcon sx={{ mr: 1 }} /> Users
          </MenuItem>
        )}
        <MenuItem component={NavLink} to="/company" onClick={onClick}>
          <BusinessIcon sx={{ mr: 1 }} /> Company
        </MenuItem>
        {!user && (
          <MenuItem component={NavLink} to="/login" onClick={onClick}>
            <LoginIcon sx={{ mr: 1 }} /> Login
          </MenuItem>
        )}
        {user && (
          <MenuItem
            onClick={async () => {
              if (await confirm('Logout', 'Are you sure you want to leave?')) {
                dispatch(logout());
                onClick?.();
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
