import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as EmailValidator from "email-validator";
import { logIn } from "../services/auth";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleLogin = async () => {
    let valid = true;

    if (!email) {
      setEmailError("Email is required.");
      valid = false;
    } else if (!EmailValidator.validate(email)) {
      setEmailError("Invalid email address.");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    }

    if (!valid) return;

    try {
      await logIn(email, password);
      setGeneralError(null);
      navigate("/dashboard"); // Redirect to the dashboard upon successful login
    } catch (err) {
      console.error(err);
      setGeneralError("Invalid email or password. Please try again.");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError("");
    if (generalError) setGeneralError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError("");
    if (generalError) setGeneralError(null);
  };

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
          maxWidth: "600px",
          width: "100%",
          padding: "32px",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          color="textPrimary"
          textAlign="center"
          gutterBottom
        >
          Login to Your Account
        </Typography>
        {generalError && (
          <Alert severity="error" sx={{ marginBottom: "16px" }}>
            {generalError}
          </Alert>
        )}
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              name="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={handleEmailChange}
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={handlePasswordChange}
              error={!!passwordError}
              helperText={passwordError}
            />
            <Button
              type="button"
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLogin}
            >
              Log in
            </Button>
          </Stack>
        </form>
        <Box mt={2} textAlign="center">
          <Button onClick={() => navigate("/")} color="secondary">
            Back to Home
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
