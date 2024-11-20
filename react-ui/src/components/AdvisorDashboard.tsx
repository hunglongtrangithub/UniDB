import React from 'react';
import { Box, Typography } from '@mui/material';

const AdvisorDashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h5">Advisor Services</Typography>
      <Typography>Welcome to the instructor dashboard! Here are your services:</Typography>
      {/* Add Advisor-specific services here */}
    </Box>
  );
};

export default AdvisorDashboard;

