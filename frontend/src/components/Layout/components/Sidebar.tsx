import React from 'react';
import { Box, List, MenuItem } from '@mui/material';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <Box>
      <List>
        <MenuItem component={NavLink} to="/">
          Home
        </MenuItem>
        <MenuItem component={NavLink} to="/users">
          users
        </MenuItem>
        <MenuItem component={NavLink} to="/register">
          register
        </MenuItem>
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
