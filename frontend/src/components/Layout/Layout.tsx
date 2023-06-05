import React from 'react';
import { Box, CssBaseline, Grid } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastConfig } from '../../config';
import Sidebar from './components/Sidebar';
import TopMenu from './components/TopMenu';

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <ToastContainer {...toastConfig} />
      <CssBaseline />
      <Box sx={{ height: '100vh', bgcolor: '#f4f4f4' }}>
        <Grid container sx={{ height: '100%' }} flexWrap="nowrap">
          <Grid item sx={{ height: '100%', width: '240px', flexShrink: 0, bgcolor: '#ff5b1e' }}>
            <Sidebar />
          </Grid>
          <Grid item sx={{ height: '100%', overflow: 'auto', flexGrow: 1 }}>
            <Box sx={{ height: '100vh', overflow: 'auto' }}>
              <Grid container direction="column" flexWrap="nowrap" sx={{ height: '100vh', overflow: 'auto' }}>
                <Grid item>
                  <TopMenu />
                </Grid>
                <Grid item flexGrow={1} overflow="auto">
                  {children}
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Layout;
