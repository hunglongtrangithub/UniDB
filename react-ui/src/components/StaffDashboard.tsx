import React from 'react';
import { Box, Typography } from '@mui/material';

const StaffDashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h5">Staff Services</Typography>
      <Typography>Welcome to the instructor dashboard! Here are your services:</Typography>
      {/* Add Staff-specific services here */}
    </Box>
  );
};

export default StaffDashboard;

