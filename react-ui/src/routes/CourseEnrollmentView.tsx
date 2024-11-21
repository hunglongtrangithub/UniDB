import React, { useEffect, useState } from "react";
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
import { getInstructorCourseEnrollments } from "../services/courses";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import LoadingScreen from "../components/LoadingScreen";

// Define types for enrollment data
interface Enrollment {
  studentId: string;
  name: string;
  grade: string;
}

interface CourseOption {
  value: string;
  label: string;
}

const CourseEnrollmentView: React.FC = () => {
  const navigate = useNavigate();
  const instructorId = useSelector((state: RootState) => state.user.userId);

  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [enrollmentData, setEnrollmentData] = useState<
    Record<string, Enrollment[]>
  >({});
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCourseEnrollments = async () => {
      if (!instructorId) return;

      setLoading(true);

      const courseEnrollments =
        await getInstructorCourseEnrollments(instructorId);
      console.log(courseEnrollments);
      if (courseEnrollments) {
        const courseOptions: CourseOption[] = [];
        const enrollmentMap: Record<string, Enrollment[]> = {};

        courseEnrollments.forEach((offering: any) => {
          const courseLabel = `${offering.courses.prefix} ${offering.courses.number} - ${offering.semesters.season} ${offering.semesters.year}`;
          const courseValue = `${offering.courses.prefix}${offering.courses.number}_${offering.semesters.year}_${offering.semesters.season}`;

          courseOptions.push({ value: courseValue, label: courseLabel });

          const enrollments: Enrollment[] = offering.course_enrollments.map(
            (enrollment: any) => ({
              studentId: enrollment.students.university_number,
              name: `${enrollment.students.users.first_name} ${enrollment.students.users.last_name}`,
              grade: enrollment.grade || "N/A",
            }),
          );

          enrollmentMap[courseValue] = enrollments;
        });

        setCourses(courseOptions);
        setEnrollmentData(enrollmentMap);

        if (courseOptions.length > 0) {
          setSelectedCourse(courseOptions[0].value);
          setEnrollments(enrollmentMap[courseOptions[0].value]);
        }
      }

      setLoading(false);
    };

    fetchCourseEnrollments();
  }, [instructorId]);

  const handleCourseChange = (event: SelectChangeEvent) => {
    const course = event.target.value;
    setSelectedCourse(course);
    setEnrollments(enrollmentData[course]);
  };

  if (loading) {
    return (
      <LoadingScreen />
    );
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
              <TableCell>
                <strong>Student ID</strong>
              </TableCell>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Grade</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enrollments.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.studentId}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.grade}</TableCell>
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
