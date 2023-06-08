import React from 'react';
import { Box } from '@mui/material';
import IntroSection from './components/IntroSection';
import FeatureSection from './components/FeatureSection';
import TImeTrackerSection from './components/TImeTrackerSection';
import SloganSection from './components/SloganSection';
import FooterSection from './components/FooterSection';

const Company = () => {
  return (
    <Box>
      <IntroSection />
      <FeatureSection />
      <TImeTrackerSection />
      <SloganSection />
      <FooterSection />
    </Box>
  );
};

export default Company;
