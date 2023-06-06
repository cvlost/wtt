import React, { useState } from 'react';
import { Drawer, Grid, IconButton, useMediaQuery } from '@mui/material';
import Logo from './Logo';
import SortIcon from '@mui/icons-material/Sort';
import theme from '../../../theme';
import Sidebar from './Sidebar';

const TopMenu = () => {
  const mdMediaQuery = useMediaQuery(theme.breakpoints.up('md'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const drawer = (
    <Drawer
      open={isDrawerOpen && !mdMediaQuery}
      anchor="left"
      onClose={() => setIsDrawerOpen(false)}
      PaperProps={{
        sx: { width: '240px', bgcolor: '#ff5b1e', flexShrink: 0 },
      }}
    >
      <Sidebar onClick={() => setIsDrawerOpen(false)} />
    </Drawer>
  );

  return (
    <>
      <Grid
        container
        sx={{
          display: {
            xs: 'flex',
            md: 'none',
          },
          px: 2,
          justifyContent: 'space-between',
          bgcolor: 'deeppink',
        }}
      >
        <Grid item>
          <Logo />
        </Grid>
        <Grid item>
          <IconButton onClick={() => setIsDrawerOpen(true)}>
            <SortIcon sx={{ color: 'white' }} />
          </IconButton>
        </Grid>
      </Grid>
      {drawer}
    </>
  );
};

export default TopMenu;
