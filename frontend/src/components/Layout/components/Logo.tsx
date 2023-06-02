import React from 'react';
import { Box, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';

const Logo = () => {
  return (
    <Box sx={{ bgcolor: 'deeppink' }}>
      <Button
        component={NavLink}
        to="/"
        startIcon={<HistoryToggleOffIcon />}
        fullWidth
        size="large"
        sx={{ color: 'white' }}
      >
        Time tracker
      </Button>
    </Box>
  );
};

export default Logo;
