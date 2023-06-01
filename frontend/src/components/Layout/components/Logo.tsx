import React from 'react';
import { Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';

const Logo = () => {
  return (
    <Button component={NavLink} to="/" startIcon={<HistoryToggleOffIcon />} fullWidth size="large">
      Time tracker
    </Button>
  );
};

export default Logo;
