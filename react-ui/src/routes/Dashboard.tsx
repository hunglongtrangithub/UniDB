import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import Navbar from '../components/Navbar';
import StudentDashboard from '../components/StudentDashboard';
import InstructorDashboard from '../components/InstructorDashboard';
import AdvisorDashboard from '../components/AdvisorDashboard';
import StaffDashboard from '../components/StaffDashboard';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Dashboard: React.FC = () => {
  const { userName, userRole } = useSelector((state: RootState) => state.user);
  if (!userName || !userRole) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const renderDashboard = () => {
    switch (userRole) {
      case 'student':
        return <StudentDashboard />;
      case 'instructor':
        return <InstructorDashboard />;
      case 'advisor':
        return <AdvisorDashboard />;
      case 'staff':
        return <StaffDashboard />;
      default:
        return <Typography>Role not recognized.</Typography>;
    }
  };

  return (
    <Box>
      <Navbar userName={userName} />
      <Box sx={{ padding: '16px' }}>
        {renderDashboard()}
      </Box>
    </Box>
  );
};

export default Dashboard;
