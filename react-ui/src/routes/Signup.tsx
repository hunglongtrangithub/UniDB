import React, { useState } from "react";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as EmailValidator from "email-validator";
import { signUp } from "../services/auth";
import PasswordValidator from "password-validator";

const passwordSchema = new PasswordValidator();
passwordSchema
  .is()
  .min(8)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .symbols();

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (!EmailValidator.validate(value)) {
      setEmailError("Invalid email address.");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (!passwordSchema.validate(value)) {
      setPasswordError("Password does not meet the criteria.");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (value !== password) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      setEmailError(!email ? "Email is required." : "");
      setPasswordError(!password ? "Password is required." : "");
      setConfirmPasswordError(!confirmPassword ? "Confirm your password." : "");
      return;
    }

    if (!emailError && !passwordError && !confirmPasswordError) {
      try {
        await signUp(email, password);
        navigate("/login");
      } catch (err) {
        console.error(err);
        setEmailError("Error signing up. Please try again.");
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Sign Up
      </Typography>
      <Typography>
        Requirements for password:
        <ul>
          <li>At least 8 characters</li>
          <li>At least one uppercase letter</li>
          <li>At least one lowercase letter</li>
          <li>At least one digit</li>
          <li>At least one symbol</li>
        </ul>
      </Typography>
      <Box mt={2}>
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={handleEmailChange}
          error={!!emailError}
          helperText={emailError}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          error={!!passwordError}
          helperText={passwordError}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={!!confirmPasswordError}
          helperText={confirmPasswordError}
          margin="normal"
        />
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleSignup}>
            Sign Up
          </Button>
        </Box>
        <Box mt={2}>
          <Button onClick={() => navigate("/login")}>Switch to Login</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
