import React from 'react';
import imgTeam from '../../../assets/team.jpg';
import { Avatar, Box, Grid, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const SloganSection = () => {
  return (
    <Box
      sx={{
        minHeight: '60vh',
        background: `url(${imgTeam}) no-repeat fixed center / cover`,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ position: 'absolute', width: '100%', top: 0, bottom: 0, bgcolor: 'rgba(0,0,0,.6)' }} />
      <Typography
        component="h2"
        variant="h3"
        color="white"
        display="flex"
        pb={3}
        position="relative"
        textAlign="center"
      >
        Concise & Efficient Solution
      </Typography>
      <Grid container justifyContent="center" spacing={1}>
        <Grid item>
          <Avatar sx={{ bgcolor: 'deeppink', width: '60px', height: '60px' }}>
            <TrendingUpIcon />
          </Avatar>
        </Grid>
        <Grid item>
          <Avatar sx={{ bgcolor: 'deeppink', width: '60px', height: '60px' }}>
            <VerifiedUserIcon />
          </Avatar>
        </Grid>
        <Grid item>
          <Avatar sx={{ bgcolor: 'deeppink', width: '60px', height: '60px' }}>
            <EqualizerIcon />
          </Avatar>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SloganSection;
