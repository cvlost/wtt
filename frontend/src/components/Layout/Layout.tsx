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
      <CssBaseline />
      <Box>
        <ToastContainer {...toastConfig} />
        <Grid container>
          <Grid item>
            <Sidebar />
          </Grid>
          <Grid item>
            <Box>
              <Grid container>
                <Grid item>
                  <TopMenu />
                </Grid>
                <Grid item>{children}</Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Layout;
