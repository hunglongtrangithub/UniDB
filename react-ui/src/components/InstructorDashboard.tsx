import React from 'react';
import { Box, Typography } from '@mui/material';

const InstructorDashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h5">Instructor Services</Typography>
      <Typography>Welcome to the instructor dashboard! Here are your services:</Typography>
      {/* Add Instructor-specific services here */}
    </Box>
  );
};

export default InstructorDashboard;

