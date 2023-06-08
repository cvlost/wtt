import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import imgGroup3 from '../../../assets/group3.png';

const TImeTrackerSection = () => {
  return (
    <Box px={2} py={4} sx={{ background: 'linear-gradient(270deg, #898bc4, transparent)' }}>
      <Grid container alignItems="center">
        <Grid item xs={12} md={6}>
          <img src={imgGroup3} style={{ maxWidth: '100%' }} alt="features" />
        </Grid>
        <Grid item xs={12} md={6} sx={{ order: { xs: -1, md: 0 } }} py={4} px={1}>
          <Box maxWidth="500px">
            <Typography component="h2" variant="h5" mb={1}>
              <Typography component="span" variant="h5" fontWeight="bold" color="deeppink">
                Time{' '}
              </Typography>
              Tracker
            </Typography>
            <Typography>
              Stay informed, accountable, and transparent. Make payroll and quarterly reporting easy with intuitive time
              tracking and accurate time reports for growing team. With the tool you get an insight into how your
              employees spend time
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TImeTrackerSection;
