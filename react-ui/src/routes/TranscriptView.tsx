import React, { useEffect, useState } from "react";
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
import LoadingScreen from "../components/LoadingScreen";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { getStudentInfo } from "../services/users";
import { getStudentCourseEnrollments } from "../services/courses";
import { calculateGPA } from "../utils/grades";
import jsPDF from "jspdf";
import "jspdf-autotable";

const TranscriptView: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useSelector((state: RootState) => state.user);
  const [studentInfo, setStudentInfo] = useState({
    name: "",
    id: "",
    major: "",
  });
  const [transcriptData, setTranscriptData] = useState<TranscriptRow[]>([]);
  const [gpaInfo, setGPAInfo] = useState({
    cumulativeGPA: 0,
    totalCredits: 0,
  });
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  interface TranscriptRow {
    semester: string;
    course: string;
    courseName: string;
    credits: number;
    grade: string;
  }

  useEffect(() => {
    const fetchStudentInfo = async () => {
      setLoading(true); // Set loading to true before fetching data

      if (userId) {
        const studentInfo = await getStudentInfo(userId);
        console.log(studentInfo);
        if (studentInfo) {
          setStudentInfo({
            name: `${studentInfo.first_name} ${studentInfo.last_name}`,
            id: studentInfo.university_number,
            major: studentInfo.major_name,
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

          const gpa = calculateGPA(transcriptData);
          setGPAInfo({
            cumulativeGPA: gpa !== null ? parseFloat(gpa.toFixed(2)) : 0,
            totalCredits: transcriptData.reduce(
              (acc, course) => acc + course.credits,
              0,
            ),
          });
        }
      }

      setLoading(false); // Set loading to false after fetching data
    };
    fetchStudentInfo();
  }, [userId]);

  const handleGenerateReport = () => {
    console.log("Generating report...");
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Academic Transcript", 14, 22);

    // Add student information
    doc.setFontSize(12);
    doc.text(`Student Name: ${studentInfo.name}`, 14, 40);
    doc.text(`Student ID: ${studentInfo.id}`, 14, 50);
    doc.text(`Major: ${studentInfo.major}`, 14, 60);

    // Prepare table data
    const tableColumn = [
      "Semester",
      "Course",
      "Course Name",
      "Credits",
      "Grade",
    ];
    const tableRows = transcriptData.map((row) => [
      row.semester,
      row.course,
      row.courseName,
      row.credits,
      row.grade,
    ]);

    // Add table
    doc.autoTable({
      startY: 70,
      head: [tableColumn],
      body: tableRows,
    });

    // Add GPA information
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Cumulative GPA: ${gpaInfo.cumulativeGPA}`, 14, finalY);
    doc.text(`Total Credits Earned: ${gpaInfo.totalCredits}`, 14, finalY + 10);

    // Save the PDF
    doc.save("Academic_Transcript.pdf");
  };

  if (loading) {
    return <LoadingScreen />;
  }

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
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateReport}
          sx={{ alignSelf: "center", marginTop: "8px" }}
        >
          Generate Transcript
        </Button>
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
