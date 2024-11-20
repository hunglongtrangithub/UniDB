import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import Navbar from '../components/Navbar';
import { getUserDetails } from '../services/user';

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const { role, firstName } = await getUserDetails();
        setUserName(firstName);
        setUserRole(role);
      } catch (err: any) {
        setError(err.message || 'Error fetching user details.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
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

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Navbar userName={userName} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 64px)', // Adjust for Navbar height
          padding: '16px',
          backgroundColor: '#f4f4f4',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome, {userName}!
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Your role: {userRole}
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
