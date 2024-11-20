import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../services/auth';

interface NavbarProps {
  userName: string | null;
}

const Navbar: React.FC<NavbarProps> = ({ userName }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (err: any) {
      console.error(err.message || 'Error logging out.');
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          UniDB
        </Typography>
        {userName && (
          <Typography variant="body1" sx={{ marginRight: 2 }}>
            Hello, {userName}!
          </Typography>
        )}
        <Button color="inherit" onClick={handleLogout}>
          Log Out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

