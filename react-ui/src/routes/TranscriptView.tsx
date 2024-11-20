import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const TranscriptView: React.FC = () => {
  const navigate = useNavigate();

  const studentInfo = {
    name: "John Doe",
    id: "12345678",
    major: "Computer Science",
  };

  const transcriptData = [
    {
      semester: "Fall 2022",
      course: "CS101",
      courseName: "Introduction to Computer Science",
      credits: 3,
      grade: "A",
    },
    {
      semester: "Fall 2022",
      course: "MATH201",
      courseName: "Calculus I",
      credits: 4,
      grade: "B+",
    },
    // Add more rows as needed
  ];

  const gpaInfo = {
    cumulativeGPA: 3.75,
    totalCredits: 30,
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
        Academic Transcript
      </Typography>

      {/* Student Information */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography>
          <strong>Student Name:</strong> {studentInfo.name}
        </Typography>
        <Typography>
          <strong>Student ID:</strong> {studentInfo.id}
        </Typography>
        <Typography>
          <strong>Major:</strong> {studentInfo.major}
        </Typography>
      </Box>

      {/* Transcript Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Semester</strong>
              </TableCell>
              <TableCell>
                <strong>Course</strong>
              </TableCell>
              <TableCell>
                <strong>Course Name</strong>
              </TableCell>
              <TableCell>
                <strong>Credits</strong>
              </TableCell>
              <TableCell>
                <strong>Grade</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transcriptData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.semester}</TableCell>
                <TableCell>{row.course}</TableCell>
                <TableCell>{row.courseName}</TableCell>
                <TableCell>{row.credits}</TableCell>
                <TableCell>{row.grade}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* GPA Information */}
      <Box sx={{ marginTop: 3 }}>
        <Typography>
          <strong>Cumulative GPA:</strong> {gpaInfo.cumulativeGPA}
        </Typography>
        <Typography>
          <strong>Total Credits Earned:</strong> {gpaInfo.totalCredits}
        </Typography>
      </Box>

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

export default TranscriptView;
