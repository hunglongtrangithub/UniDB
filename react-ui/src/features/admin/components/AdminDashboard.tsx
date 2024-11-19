import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

// Mock data fetching functions (replace with actual API calls)
const fetchGPAData = async () => {
  return {
    byMajor: [
      { major: "CS", highest: 4.0, lowest: 2.1, average: 3.2 },
      { major: "MATH", highest: 3.8, lowest: 2.5, average: 3.1 },
    ],
    byDepartment: [
      { department: "Engineering", averageGPA: 3.4 },
      { department: "Arts", averageGPA: 2.9 },
    ],
  };
};

const fetchSemesterEnrollments = async () => {
  return [
    {
      semester: "Fall 2024",
      course: "CS101",
      totalEnrollments: 50,
      averageGrade: 3.5,
    },
    {
      semester: "Spring 2024",
      course: "MATH201",
      totalEnrollments: 30,
      averageGrade: 2.8,
    },
  ];
};

const fetchInstructorData = async () => {
  return [
    { instructor: "Dr. Smith", major: "CS", totalStudents: 120 },
    { instructor: "Dr. Jones", major: "MATH", totalStudents: 80 },
  ];
};

const fetchStudentsByMajor = async () => {
  return {
    CS: [
      { name: "Alice", totalCredits: 90 },
      { name: "Bob", totalCredits: 85 },
    ],
    MATH: [
      { name: "Carol", totalCredits: 100 },
      { name: "Dan", totalCredits: 70 },
    ],
  };
};

type GPAData = {
  byMajor: {
    major: string;
    highest: number;
    lowest: number;
    average: number;
  }[];
  byDepartment: {
    department: string;
    averageGPA: number;
  }[];
};

type CourseEnrollmentData = {
  semester: string;
  course: string;
  totalEnrollments: number;
  averageGrade: number;
};

type InstructorData = {
  instructor: string;
  major: string;
  totalStudents: number;
};

type StudentDataByMajor = {
  CS: { name: string; totalCredits: number }[];
  MATH: { name: string; totalCredits: number }[];
};

const AdminDashboard = ({ userRole }) => {
  const [gpaData, setGPAData] = useState<GPAData | null>(null);
  const [semesterData, setSemesterData] = useState<CourseEnrollmentData[]>([]);
  const [instructorData, setInstructorData] = useState<InstructorData[]>([]);
  const [studentsByMajor, setStudentsByMajor] = useState<StudentDataByMajor>({
    CS: [],
    MATH: [],
  });

  useEffect(() => {
    if (userRole === "admin") {
      // Fetch data on component load
      fetchGPAData().then(setGPAData);
      fetchSemesterEnrollments().then(setSemesterData);
      fetchInstructorData().then(setInstructorData);
      fetchStudentsByMajor().then(setStudentsByMajor);
    }
  }, [userRole]);

  if (userRole !== "admin") {
    return <Typography>You do not have access to this page.</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* GPA Section */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h5">GPA Statistics</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">GPA by Major</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Major</TableCell>
                    <TableCell>Highest GPA</TableCell>
                    <TableCell>Lowest GPA</TableCell>
                    <TableCell>Average GPA</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gpaData?.byMajor.map((row) => (
                    <TableRow key={row.major}>
                      <TableCell>{row.major}</TableCell>
                      <TableCell>{row.highest}</TableCell>
                      <TableCell>{row.lowest}</TableCell>
                      <TableCell>{row.average}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6">Department Rankings</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Department</TableCell>
                    <TableCell>Average GPA</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gpaData?.byDepartment.map((row) => (
                    <TableRow key={row.department}>
                      <TableCell>{row.department}</TableCell>
                      <TableCell>{row.averageGPA}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Paper>

      {/* Semester Enrollments */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h5">Semester Enrollments</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Semester</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Total Enrollments</TableCell>
                <TableCell>Average Grade</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {semesterData.map((row) => (
                <TableRow key={`${row.semester}-${row.course}`}>
                  <TableCell>{row.semester}</TableCell>
                  <TableCell>{row.course}</TableCell>
                  <TableCell>{row.totalEnrollments}</TableCell>
                  <TableCell>{row.averageGrade}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Instructor Data */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h5">Instructor Statistics</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Instructor</TableCell>
                <TableCell>Major</TableCell>
                <TableCell>Total Students</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {instructorData.map((row) => (
                <TableRow key={row.instructor}>
                  <TableCell>{row.instructor}</TableCell>
                  <TableCell>{row.major}</TableCell>
                  <TableCell>{row.totalStudents}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Students by Major */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5">Students by Major</Typography>
        {Object.keys(studentsByMajor).map((major) => (
          <Box key={major} sx={{ mb: 2 }}>
            <Typography variant="h6">{major}</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Total Credits</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentsByMajor[major].map((student) => (
                    <TableRow key={student.name}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.totalCredits}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
