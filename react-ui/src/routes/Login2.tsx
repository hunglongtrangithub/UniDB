import React, { useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as EmailValidator from "email-validator";
import { logIn } from "../services/auth";

export default function AuthModals() {
  const navigate = useNavigate();
  const [openLogin, setOpenLogin] = useState(true);
  const [openSignup, setOpenSignup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  const handleOpenSignup = () => setOpenSignup(true);
  const handleCloseSignup = () => setOpenSignup(false);

  const switchToSignup = () => {
    setOpenLogin(false);
    setOpenSignup(true);
  };

  const switchToLogin = () => {
    setOpenSignup(false);
    setOpenLogin(true);
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
    <div>
      {!isAuthenticated && (
        <>
          {/* Login Dialog */}
          <Dialog open={openLogin} onClose={() => {}} disableEscapeKeyDown>
            <Box paddingTop={5}>
              <Typography
                variant="h3"
                component="h2"
                textAlign="center"
                gutterBottom
              >
                Welcome to the School Management System
              </Typography>
            </Box>
            <Box paddingLeft={5} paddingRight={5} paddingBottom={5}>
              <Typography
                variant="h6"
                component="h2"
                textAlign="center"
                gutterBottom
              >
                Login
              </Typography>
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                value={email}
                onChange={handleEmailChange}
                error={!!emailError}
                helperText={emailError}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={handlePasswordChange}
                error={!!passwordError}
                helperText={passwordError}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleLogin}
              >
                Login
              </Button>
              <Typography textAlign="center" variant="body2" sx={{ mt: 2 }}>
                Not registered?{" "}
                <Link href="#" onClick={switchToSignup}>
                  Sign up here
                </Link>
              </Typography>
            </Box>
          </Dialog>

          {/* Signup Dialog */}
          <Dialog open={openSignup} onClose={() => {}} disableEscapeKeyDown>
            <Box paddingTop={5}>
              <Typography
                variant="h3"
                component="h2"
                textAlign="center"
                gutterBottom
              >
                Sign up to access your dashboard
              </Typography>
            </Box>
            <Box paddingLeft={5} paddingRight={5} paddingBottom={5}>
              <Typography
                variant="h6"
                component="h2"
                textAlign="center"
                gutterBottom
              >
                Sign Up
              </Typography>
              <TextField label="Email" fullWidth margin="normal" />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
              />
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleLogin}
              >
                Sign Up
              </Button>
              <Typography textAlign="center" variant="body2" sx={{ mt: 2 }}>
                Already registered?{" "}
                <Link href="#" onClick={switchToLogin}>
                  Login here
                </Link>
              </Typography>
            </Box>
          </Dialog>
        </>
      )}

      {isAuthenticated && <div> {/* Main App Content Goes Here */} </div>}
    </div>
  );
}
