import React from 'react';
import { CircularProgress } from '@mui/material';

const MainPreloader = () => {
  return <CircularProgress sx={{ display: 'block', margin: '2em auto', color: 'gray' }} />;
};

export default MainPreloader;
