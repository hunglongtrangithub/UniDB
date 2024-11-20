import React from "react";
import { Box, Typography, Button, Stack, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
        padding: "16px",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: "800px",
          width: "100%",
          padding: "32px",
          textAlign: "center",
        }}
      >
        <Box sx={{ marginBottom: "16px" }}>
          <Typography variant="h4" component="h1" color="textPrimary">
            Welcome to UniDB
          </Typography>
        </Box>
        <Box sx={{ marginBottom: "24px" }}>
          <Typography variant="body1" color="textSecondary">
            Welcome to UniDB! Please use the navigation links below to access
            different features.
          </Typography>
        </Box>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ marginBottom: "24px" }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/signup")}
          >
            Signup
          </Button>
        </Stack>
        <Box
          sx={{ marginTop: "24px", fontSize: "14px", color: "textSecondary" }}
        >
          <Typography variant="body2">
            * Use the "Login" link to access your account.
          </Typography>
          <Typography variant="body2">
            * Use the "Signup" link to create a new account.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default WelcomePage;
