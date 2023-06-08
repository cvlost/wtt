import React from 'react';
import { Box, Chip, Grid, Typography } from '@mui/material';
import imgGroup2 from '../../../assets/group2.png';

const IntroSection = () => {
  return (
    <Box p={2} sx={{ background: 'linear-gradient(270deg, #898bc4, transparent)' }}>
      <Box p={2} sx={{ background: 'linear-gradient(270deg, #898bc4, transparent)' }}>
        <Grid container sx={{ background: 'linear-gradient(270deg, #898bc4, transparent)' }}>
          <Grid item container xs={12} md={6} justifyContent="center" alignItems="center" textAlign="center">
            <Box color="#2c3e50" mb={5}>
              <Typography component="h1" variant="h4">
                <Typography component="span" variant="h5" fontWeight="bold" color="deeppink">
                  Software
                </Typography>{' '}
                for{' '}
              </Typography>
              <Typography component="h1" variant="h4" mb={1}>
                <Typography component="span" variant="h5" fontWeight="bold" color="orangered">
                  productive
                </Typography>{' '}
                people
              </Typography>
              <Typography component="h1" variant="h4" fontWeight="bold">
                Work Time Tracker
              </Typography>
              <Box pt={3} mb={1}>
                <Chip
                  label={'Remote work & staff management'}
                  sx={{ bgcolor: '#2c3e50', color: 'white', fontWeight: 'bold' }}
                  variant="outlined"
                />
              </Box>
              <Box mb={1}>
                <Chip
                  label={'Reports & total time'}
                  sx={{ bgcolor: '#2c3e50', color: 'white', fontWeight: 'bold' }}
                  variant="outlined"
                />
              </Box>
              <Box mb={1}>
                <Chip
                  label={'Just awesome'}
                  sx={{ bgcolor: 'deeppink', color: 'white', fontWeight: 'bold' }}
                  variant="outlined"
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <img src={imgGroup2} style={{ maxWidth: '100%' }} alt="features" />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default IntroSection;
