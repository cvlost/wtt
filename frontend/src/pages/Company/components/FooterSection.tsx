import React from 'react';
import { Box } from '@mui/material';
import LoginInvite from './LoginInvite';

const FooterSection = () => {
  return (
    <Box sx={{ background: 'linear-gradient(270deg, #898bc4, transparent)', p: 2 }}>
      <LoginInvite />
    </Box>
  );
};

export default FooterSection;
