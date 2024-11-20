import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as EmailValidator from "email-validator";
import PasswordValidator from "password-validator";
import { signUp } from "../services/auth";

const roles = [
  { label: "Student", value: "student" },
  { label: "Instructor", value: "instructor" },
  { label: "Advisor", value: "advisor" },
  { label: "Staff", value: "staff" },
];

// Password validation schema
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

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: EmailValidator.validate(value) ? "" : "Invalid email address.",
      }));
    } else if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: passwordSchema.validate(value)
          ? ""
          : "Password does not meet criteria (min 8 chars, uppercase, lowercase, digit, symbol).",
      }));
    } else if (name === "confirmPassword") {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          value === formData.password ? "" : "Passwords do not match.",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { firstName, lastName, email, password, role } = formData;

    if (!firstName || !lastName || !email || !password || !role) {
      setError("All fields are required.");
      return;
    }

    if (errors.email || errors.password || errors.confirmPassword) {
      setError("Please fix the errors in the form.");
      return;
    }

    try {
      // Call the Supabase signUp function with email, password, and additional options
      await signUp(email, password, {
        data: {
          firstName,
          lastName,
          role,
        },
      });
      setSuccess(true);
      setError(null);
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to sign up. Please try again.");
    }
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
          Sign Up
        </Typography>
        {error && (
          <Alert severity="error" sx={{ marginBottom: "16px" }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ marginBottom: "16px" }}>
            Sign up successful!
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="First Name"
              name="firstName"
              variant="outlined"
              fullWidth
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <TextField
              label="Last Name"
              name="lastName"
              variant="outlined"
              fullWidth
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <TextField
              label="Email"
              name="email"
              variant="outlined"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              required
            />
            <TextField
              label="Role"
              name="role"
              select
              variant="outlined"
              fullWidth
              value={formData.role}
              onChange={handleChange}
              required
            >
              {roles.map(({ label, value }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              required
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              variant="outlined"
              fullWidth
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Sign Up
            </Button>
          </Stack>
        </form>
        <Box mt={2}>
          <Button onClick={() => navigate("/login")} color="secondary">
            Already have an account? Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SignupPage;
