import React from 'react';
import { Box, Button, useMediaQuery } from '@mui/material';
import { NavLink } from 'react-router-dom';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import theme from '../../../theme';

interface Props {
  onClick?: () => void;
}

const Logo: React.FC<Props> = ({ onClick = undefined }) => {
  const mdMediaQuery = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box sx={{ bgcolor: 'deeppink' }}>
      <Button
        component={NavLink}
        to="/"
        startIcon={<HistoryToggleOffIcon />}
        size="large"
        sx={{ color: 'white' }}
        fullWidth={mdMediaQuery}
        onClick={onClick}
      >
        Time tracker
      </Button>
    </Box>
  );
};

export default Logo;
