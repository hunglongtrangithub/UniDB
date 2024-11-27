import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { getStaffDepartment } from "../services/users";

const AddCourseForm: React.FC = () => {
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.user.userId);

  // States for form inputs
  const [coursePrefix, setCoursePrefix] = useState<string>("");
  const [courseNumber, setCourseNumber] = useState<string>("");
  const [courseCredits, setCourseCredits] = useState<number | "">("");
  const [departmentId, setDepartmentId] = useState<number>(0);
  const [description, setDescription] = useState<string>("");

  // States for validation messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartment = async () => {
      if (!userId) return;
      const department = await getStaffDepartment(userId);
      if (!department) return;
      console.log(department);
      const departmentId = department.id || 0;
      setDepartmentId(departmentId);
    };
    fetchDepartment();
  }, [userId]);

  // Validation logic
  const validateForm = () => {
    if (!coursePrefix || !courseNumber || !courseCredits) {
      setErrorMessage("Error: All fields are required.");
      return false;
    }

    if (!/^[A-Za-z]{2,4}$/.test(coursePrefix)) {
      setErrorMessage("Error: Course prefix must be 2-4 letters.");
      return false;
    }

    if (!/^\d{3}$/.test(courseNumber)) {
      setErrorMessage("Error: Course number must be exactly 3 digits.");
      return false;
    }

    if (courseCredits < 1 || courseCredits > 4) {
      setErrorMessage("Error: Course credits must be between 1 and 4.");
      return false;
    }

    setErrorMessage(null); // Clear error if validation passes
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Simulate mock function to check for duplicate course ID
    const isDuplicate = false; // Replace with real API call
    if (isDuplicate) {
      setErrorMessage("Error: Duplicate course ID detected.");
      return;
    }

    // Simulate successful course creation
    const success = true; // Replace with real API call
    if (!success) {
      setErrorMessage("Error: Failed to add course.");
      return;
    } else {
      setSuccessMessage("Course added successfully!");
      // reset form fields
      setCoursePrefix("");
      setCourseNumber("");
      setCourseCredits("");
      setDescription("");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "25px",
        backgroundColor: "#ffffff",
        borderRadius: "5px",
        border: "1px solid #ced4da",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Add New Course
      </Typography>

      {/* Error Message */}
      {errorMessage && (
        <Alert severity="error" sx={{ marginBottom: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Success Message */}
      {successMessage && (
        <Alert severity="success" sx={{ marginBottom: 3 }}>
          {successMessage}
        </Alert>
      )}

      {/* Course Prefix */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="body1" gutterBottom>
          Course Prefix:
        </Typography>
        <TextField
          fullWidth
          placeholder="Enter course prefix (e.g., CS)"
          value={coursePrefix}
          onChange={(e) => setCoursePrefix(e.target.value.toUpperCase())}
        />
      </Box>

      {/* Course Number */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="body1" gutterBottom>
          Course Number:
        </Typography>
        <TextField
          fullWidth
          placeholder="Enter course number (e.g., 101)"
          value={courseNumber}
          onChange={(e) => setCourseNumber(e.target.value)}
        />
      </Box>

      {/* Course Credits */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="body1" gutterBottom>
          Course Credits:
        </Typography>
        <TextField
          fullWidth
          type="number"
          placeholder="Enter credits (1-4)"
          value={courseCredits}
          onChange={(e) => setCourseCredits(Number(e.target.value))}
          inputProps={{ min: 1, max: 4 }}
        />
      </Box>

      {/* Description */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="body1" gutterBottom>
          Description (Optional):
        </Typography>
        <TextField
          fullWidth
          multiline
          minRows={3}
          placeholder="Enter course description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Box>

      {/* Button Group */}
      <Box sx={{ textAlign: "center", marginTop: 3 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginRight: 1 }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/dashboard")}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default AddCourseForm;
