import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const StudentEnrollmentForm: React.FC = () => {
  const navigate = useNavigate();

  // States for form inputs
  const [studentSearch, setStudentSearch] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sample data for courses
  const courseOptions = [
    { value: "offering1", label: "Course 1 - Fall 2023", capacity: 30, enrolled: 25 },
    { value: "offering2", label: "Course 2 - Spring 2024", capacity: 20, enrolled: 20 },
  ];

  // Sample data for validation
  const studentData = {
    id: "student123",
    department: "Computer Science",
  };
  const advisorDepartment = "Computer Science";

  const handleEnrollClick = () => {
    setErrorMessage(null);

    // E1: Department Mismatch
    if (studentSearch !== studentData.id || studentData.department !== advisorDepartment) {
      setErrorMessage("Error: Student is not in your department.");
      return;
    }

    // E2: Duplicate Enrollment
    if (studentSearch === "student123" && selectedCourse === "offering1") {
      setErrorMessage("Error: Student is already enrolled in this course.");
      return;
    }

    // E3: Course Full
    const course = courseOptions.find((c) => c.value === selectedCourse);
    if (course && course.enrolled >= course.capacity) {
      setErrorMessage("Error: Course capacity reached.");
      return;
    }

    // Simulate enrollment success
    alert(`Successfully enrolled ${studentSearch} in ${selectedCourse}`);
    // Enrollment logic/API call can be added here
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
        Enroll Student in Course
      </Typography>

      {/* Error Message */}
      {errorMessage && (
        <Alert severity="error" sx={{ marginBottom: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Student Search Field */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="body1" gutterBottom>
          Search Student:
        </Typography>
        <TextField
          fullWidth
          placeholder="Enter student ID or name"
          value={studentSearch}
          onChange={(e) => setStudentSearch(e.target.value)}
        />
      </Box>

      {/* Course Selection Dropdown */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="body1" gutterBottom>
          Select Course Offering:
        </Typography>
        <Select
          fullWidth
          displayEmpty
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <MenuItem value="">
            <em>-- Select Course Offering --</em>
          </MenuItem>
          {courseOptions.map((course) => (
            <MenuItem key={course.value} value={course.value}>
              {`${course.label} (Capacity: ${course.enrolled}/${course.capacity})`}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Button Group */}
      <Box sx={{ textAlign: "center", marginTop: 3 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginRight: 1 }}
          onClick={handleEnrollClick}
        >
          Enroll Student
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/dashboard")}
        >
          Cancel
        </Button>
      </Box>

      {/* Annotations */}
      <Box sx={{ marginTop: 3 }}>
        <Typography variant="caption" color="textSecondary" display="block">
          * This form allows advisors to enroll a student in a course offering.
        </Typography>
        <Typography variant="caption" color="textSecondary" display="block">
          * Advisors can search for a student by ID or name.
        </Typography>
        <Typography variant="caption" color="textSecondary" display="block">
          * Course offerings are selected from a dropdown list.
        </Typography>
        <Typography variant="caption" color="textSecondary" display="block">
          * The "Enroll Student" button submits the enrollment request.
        </Typography>
        <Typography variant="caption" color="textSecondary" display="block">
          * The "Cancel" button returns to the Main Dashboard.
        </Typography>
      </Box>
    </Box>
  );
};

export default StudentEnrollmentForm;
