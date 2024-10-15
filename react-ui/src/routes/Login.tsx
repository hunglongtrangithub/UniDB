import React, { useState } from "react";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as EmailValidator from "email-validator";
import { logIn } from "../services/auth";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

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
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setEmailError("Invalid email or password. Please try again.");
      setPasswordError("Invalid email or password. Please try again.");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError("");
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Login to Your Account
      </Typography>
      <Box mt={2}>
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={handleEmailChange}
          margin="normal"
          error={!!emailError}
          helperText={emailError}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          margin="normal"
          error={!!passwordError}
          helperText={passwordError}
        />
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Log in
          </Button>
        </Box>
        <Box mt={2}>
          <Button onClick={() => navigate("/")}>Back</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
