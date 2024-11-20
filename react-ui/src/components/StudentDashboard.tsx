import React from 'react';
import { Box, Typography } from '@mui/material';

const StudentDashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h5">Student Services</Typography>
      <Typography>Welcome to the student dashboard! Here are your services:</Typography>
      {/* Add Student-specific services here */}
    </Box>
  );
};

export default StudentDashboard;

