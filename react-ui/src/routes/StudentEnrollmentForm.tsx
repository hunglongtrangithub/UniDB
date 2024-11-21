import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getStudentByUniversityNumber,
  getDepartmentsByAdvisor,
} from "../services/users";
import {
  getCourseOfferings,
  getStudentCourseEnrollments,
} from "../services/courses";
import { RootState } from "../store";

interface CourseOption {
  id: string;
  label: string;
  capacity: number;
  enrolled: number;
}

const StudentEnrollmentForm: React.FC = () => {
  const navigate = useNavigate();

  const userId = useSelector((state: RootState) => state.user.userId);
  const [advisorDepartments, setAdvisorDepartments] = useState<string[]>([]);

  const [studentSearch, setStudentSearch] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<CourseOption | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [courseOptions, setCourseOptions] = useState<CourseOption[]>([]);
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [studentEnrollments, setStudentEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // get departments for advisor
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!userId) return;
      const departments = await getDepartmentsByAdvisor(userId);
      if (departments) {
        const department_names = departments.map(
          (dept) => dept.departments.name,
        );
        console.log(department_names);
        setAdvisorDepartments(department_names);
      }
    };

    fetchDepartments();
  }, [userId]);

  useEffect(() => {
    const fetchCourseOptions = async () => {
      const courseOptions: CourseOption[] = [];
      const courseOfferings = await getCourseOfferings();
      if (courseOfferings) {
        courseOfferings.forEach((offering) => {
          courseOptions.push({
            id: offering.id,
            label: `${offering.courses.prefix} ${offering.courses.number} - ${offering.semesters.season} ${offering.semesters.year}`,
            capacity: offering.rooms.capacity,
            enrolled: offering.course_enrollments.length,
          });
        });
        setCourseOptions(courseOptions);
      }
    };

    fetchCourseOptions();
  }, []);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      setSuccessMessage(null);
      if (!studentSearch) {
        setErrorMessage(null);
        setStudentInfo(null);
        return;
      }
      if (studentSearch.match(/^U[0-9]{8}$/)) {
        setLoading(true);

        const fetchedStudentInfo =
          await getStudentByUniversityNumber(studentSearch);
        if (!fetchedStudentInfo) {
          setErrorMessage("Error: Student not found.");
          setStudentInfo(null);
          setLoading(false);
          return;
        }
        const studentInfo = {
          first_name: fetchedStudentInfo.first_name,
          last_name: fetchedStudentInfo.last_name,
          department: fetchedStudentInfo.department_name,
          major: fetchedStudentInfo.major_name,
        };
        setStudentInfo(studentInfo);

        // Get student enrollments
        const studentEnrollments = await getStudentCourseEnrollments(
          fetchedStudentInfo.id,
        );
        if (!studentEnrollments) {
          setStudentEnrollments([]);
          setLoading(false);
          return;
        }
        setErrorMessage(null);
        setStudentEnrollments(studentEnrollments);
        setLoading(false);
      } else {
        setErrorMessage(
          "Error: Invalid student ID format. It should be in the form 'U12345678'.",
        );
        setStudentInfo(null);
      }
    };

    fetchStudentInfo();
  }, [studentSearch]);

  const handleEnrollClick = () => {
    setErrorMessage(null);
    if (!studentSearch || !selectedCourse) {
      setErrorMessage("Error: Please fill out all fields.");
      return;
    }

    // Check if student ID is valid
    const studentIdPattern = /^U[0-9]{8}$/;
    if (!studentIdPattern.test(studentSearch)) {
      setErrorMessage(
        "Error: Invalid student ID format. It should be in the form 'U12345678'.",
      );
      return;
    }

    // Check if student exists
    if (!studentInfo) {
      setErrorMessage("Error: Student not found.");
      return;
    }

    // E1: Department Mismatch
    console.log(advisorDepartments, studentInfo.department);
    if (!advisorDepartments.includes(studentInfo.department)) {
      setErrorMessage("Error: Student is not in your departments.");
      return;
    }

    // E2: Duplicate Enrollment
    if (
      studentEnrollments.some(
        (e: any) => e.course_offering_id === selectedCourse.id,
      )
    ) {
      setErrorMessage("Error: Student is already enrolled in this course.");
      return;
    }

    // E3: Course Full
    if (selectedCourse.enrolled >= selectedCourse.capacity) {
      setErrorMessage("Error: Course capacity reached.");
      return;
    }

    // Enroll student
    console.log("Enrolling student...");
    setErrorMessage(null);
    setSuccessMessage("Student enrolled successfully!");
    setStudentSearch("");
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
      <Typography variant="body1" align="center" gutterBottom>
        Semester: Fall 2024
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

      {/* Student Search Field */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="body1" gutterBottom>
          Search Student by ID:
        </Typography>
        <TextField
          fullWidth
          placeholder="Enter student ID"
          value={studentSearch}
          onChange={(e) => setStudentSearch(e.target.value)}
        />
      </Box>
      {/* Student Info Box */}
      {loading ? (
        <CircularProgress />
      ) : (
        studentInfo && (
          <Box
            sx={{
              marginBottom: 3,
              padding: 2,
              border: "1px solid #ced4da",
              borderRadius: "5px",
            }}
          >
            <Typography variant="body1">
              <strong>Name:</strong> {studentInfo.first_name}{" "}
              {studentInfo.last_name}
            </Typography>
            <Typography variant="body1">
              <strong>Department:</strong> {studentInfo.department}
            </Typography>
            <Typography variant="body1">
              <strong>Major:</strong> {studentInfo.major}
            </Typography>
          </Box>
        )
      )}
      {/* Course Selection Dropdown */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="body1" gutterBottom>
          Select Course Offering:
        </Typography>
        <Select
          fullWidth
          displayEmpty
          value={selectedCourse ? selectedCourse.id : ""}
          onChange={(e) =>
            setSelectedCourse(
              courseOptions.find((course) => course.id === e.target.value) ||
                null,
            )
          }
        >
          <MenuItem value="">
            <em>-- Select Course Offering --</em>
          </MenuItem>
          {courseOptions.map((course) => (
            <MenuItem key={course.id} value={course.id}>
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
          * Advisors can search for a student by ID.
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
