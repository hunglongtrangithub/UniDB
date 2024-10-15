import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (): void => {
    navigate("/login");
  };

  const handleSignup = (): void => {
    navigate("/signup");
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the School Management System
      </Typography>
      <Typography variant="body1">
        Please log in or sign up to access your dashboard.
      </Typography>
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          sx={{ mr: 2 }}
        >
          Log in
        </Button>
        <Typography variant="body2" display="block" gutterBottom>
          New user? Sign up here.
        </Typography>
        <Button variant="contained" color="secondary" onClick={handleSignup}>
          Sign up
        </Button>
      </Box>
    </Container>
  );
};

export default Welcome;
