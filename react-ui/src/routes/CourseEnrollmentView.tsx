
import React, { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CourseEnrollmentView: React.FC = () => {
  const navigate = useNavigate();

  // Sample data for course offerings and enrollment
  const courses = [
    { value: "cs101_fall2023", label: "CS101 - Fall 2023" },
    { value: "cs202_spring2024", label: "CS202 - Spring 2024" },
  ];

  const enrollmentData = {
    cs101_fall2023: [
      { studentId: "12345678", name: "John Doe", status: "Enrolled" },
      { studentId: "87654321", name: "Jane Smith", status: "Enrolled" },
    ],
    cs202_spring2024: [
      { studentId: "11223344", name: "Alice Johnson", status: "Enrolled" },
      { studentId: "44332211", name: "Bob Brown", status: "Enrolled" },
    ],
  };

  const [selectedCourse, setSelectedCourse] = useState<keyof typeof enrollmentData>("cs101_fall2023");
  const [enrollments, setEnrollments] = useState(enrollmentData[selectedCourse]);

  const handleCourseChange = (event: SelectChangeEvent) => {
    const course = event.target.value as keyof typeof enrollmentData;
    setSelectedCourse(course);
    setEnrollments(enrollmentData[course]);
  };

  return (
    <Box
      sx={{
        padding: 4,
        maxWidth: "800px",
        margin: "50px auto",
        backgroundColor: "#ffffff",
        borderRadius: "5px",
        border: "1px solid #ced4da",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Course Enrollment View
      </Typography>

      {/* Course Selection */}
      <Box sx={{ marginBottom: 3, textAlign: "center" }}>
        <Typography variant="body1" gutterBottom>
          Select Course Offering:
        </Typography>
        <Select
          value={selectedCourse}
          onChange={handleCourseChange}
          displayEmpty
          sx={{ width: "300px" }}
        >
          {courses.map((course) => (
            <MenuItem key={course.value} value={course.value}>
              {course.label}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Enrollment Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Student ID</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Enrollment Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enrollments.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.studentId}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Button Group */}
      <Box sx={{ marginTop: 4, textAlign: "center" }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default CourseEnrollmentView;
