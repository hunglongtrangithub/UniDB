import React, { useEffect } from "react";
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
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { getStudentInfo } from "../services/users";
import { getStudentCourseEnrollments } from "../services/courses";
import { calculateGPA } from "../utils/grades";

const TranscriptView: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useSelector((state: RootState) => state.user);
  const [studentInfo, setStudentInfo] = React.useState({
    name: "",
    id: "",
    major: "",
  });
  interface TranscriptRow {
    semester: string;
    course: string;
    courseName: string;
    credits: number;
    grade: string;
  }

  const [transcriptData, setTranscriptData] = React.useState<TranscriptRow[]>(
    [],
  );
  const [gpaInfo, setGPAInfo] = React.useState({
    cumulativeGPA: 0,
    totalCredits: 0,
  });

  useEffect(() => {
    const fetchStudentInfo = async () => {
      if (userId) {
        const studentInfo = await getStudentInfo(userId);
        console.log(studentInfo);
        if (studentInfo) {
          setStudentInfo({
            name: `${studentInfo.first_name} ${studentInfo.last_name}`,
            id: studentInfo.university_number,
            major: studentInfo.major,
          });
        }

        const studentCourses = await getStudentCourseEnrollments(userId);
        console.log(studentCourses);
        if (studentCourses) {
          const transcriptData = studentCourses.map((course) => ({
            semester: `${course.course_offerings.semesters.season} ${course.course_offerings.semesters.year}`,
            course: `${course.course_offerings.courses.prefix}${course.course_offerings.courses.number}`,
            courseName: course.course_offerings.courses.name,
            credits: course.course_offerings.courses.credits,
            grade: course.grade,
          }));
          setTranscriptData(transcriptData);

          setGPAInfo({
            cumulativeGPA: calculateGPA(transcriptData) || 0,
            totalCredits: transcriptData.reduce(
              (acc, course) => acc + course.credits,
              0,
            ),
          });
        }
      }
    };
    fetchStudentInfo();

    // Calculate GPA
  }, [userId]);

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
