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
      <Box sx={{ height: '100vh' }}>
        <Grid container sx={{ height: '100%' }}>
          <Grid item xs={3} sx={{ boxShadow: 3, height: '100%' }}>
            <Sidebar />
          </Grid>
          <Grid item xs={9} sx={{ boxShadow: 3, height: '100%', overflow: 'auto' }}>
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
