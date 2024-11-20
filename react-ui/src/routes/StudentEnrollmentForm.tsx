import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const StudentEnrollmentForm: React.FC = () => {
  const navigate = useNavigate();

  // States for form inputs
  const [studentSearch, setStudentSearch] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  // Sample data for courses
  const courseOptions = [
    { value: "offering1", label: "Course 1 - Fall 2023" },
    { value: "offering2", label: "Course 2 - Spring 2024" },
  ];

  const handleEnrollClick = () => {
    if (!studentSearch || !selectedCourse) {
      alert("Please fill in all fields before submitting.");
    } else {
      // Simulate enrollment logic
      alert(`Enrolled ${studentSearch} in ${selectedCourse}`);
      // You can add your enrollment logic/API call here
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
        Enroll Student in Course
      </Typography>

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
              {course.label}
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

