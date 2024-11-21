import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  Button,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { getStudentCourseEnrollments, getCourses } from "../services/courses";

const gradePointMap: { [key: string]: number } = {
  A: 4.0,
  B: 3.0,
  C: 2.0,
  D: 1.0,
  F: 0.0,
};

const calculateNewGPA = (
  courses: {
    credits: number;
    grade: string;
  }[],
) => {
  let totalCredits = 0;
  let totalPoints = 0;

  courses.forEach((course) => {
    if (course.grade && course.credits) {
      totalCredits += course.credits;
      totalPoints += course.credits * (gradePointMap[course.grade] || 0);
    }
  });

  const newGPA = totalCredits > 0 ? totalPoints / totalCredits : null;
  return newGPA;
};

const WhatIfGPAAnalysis: React.FC = () => {
  const navigate = useNavigate();

  const [currentGPA, setCurrentGPA] = useState(0); // Example current GPA
  const [newGPA, setNewGPA] = useState<number | null>(null); // New GPA for analysis
  const [courses, setCourses] = useState([
    { course: "", credits: 0, grade: "" },
  ]); // Hypothetical courses

  const [courseCreditMap, setCourseCreditMap] = useState<{
    [key: string]: number;
  }>({});

  const userId = useSelector((state: RootState) => state.user.userId);

  useEffect(() => {
    async function fetch() {
      if (userId) {
        const enrollments = await getStudentCourseEnrollments(userId);
        if (enrollments) {
          const grades = enrollments.map((enrollment: any) => ({
            grade: enrollment.grade,
            credits: enrollment.course_offerings.courses.credits,
          }));
          const calculatedGPA = calculateNewGPA(grades);
          if (calculatedGPA !== null) {
            setCurrentGPA(parseFloat(calculatedGPA.toFixed(2)));
          }
        }
      }

      const courses = await getCourses();
      if (courses) {
        setCourseCreditMap(
          courses.reduce((acc: any, course: any) => {
            acc[course.name] = course.credits;
            return acc;
          }, {}),
        );
      }
    }
    fetch();
  }, [userId]);

  const handleAddRow = () => {
    setCourses([...courses, { course: "", credits: 0, grade: "" }]);
  };

  const handleRemoveRow = (index: number) => {
    const updatedCourses = courses.filter((_, i) => i !== index);
    setCourses(updatedCourses);
    const calculatedGPA = calculateNewGPA(updatedCourses);
    if (calculatedGPA !== null) {
      setNewGPA(parseFloat(calculatedGPA.toFixed(2)));
    }
  };

  const handleInputChange = (
    index: number,
    field: "course" | "grade", // Only course and grade are editable
    value: any,
  ) => {
    // console.log(index, field, value);
    const updatedCourses = [...courses];
    updatedCourses[index] = {
      ...updatedCourses[index], // Spread existing course data
      [field]: value, // Dynamically set the specific field
      credits:
        field === "course"
          ? courseCreditMap[value] || 0
          : updatedCourses[index].credits, // Update credits
    };
    console.log(updatedCourses);
    setCourses(updatedCourses);
    const calculatedGPA = calculateNewGPA(updatedCourses);
    if (calculatedGPA !== null) {
      setNewGPA(parseFloat(calculatedGPA.toFixed(2)));
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: "800px", margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom>
        What-If GPA Analysis
      </Typography>
      <Typography variant="h6" gutterBottom>
        Current GPA: <strong>{currentGPA}</strong>
      </Typography>
      <Typography variant="h6" gutterBottom>
        New GPA: <strong>{newGPA !== null ? newGPA : "N/A"}</strong>
      </Typography>
      <Typography variant="body1" gutterBottom>
        Add hypothetical courses and expected grades to see the impact on your
        GPA.
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Course</TableCell>
            <TableCell>Credits</TableCell>
            <TableCell>Expected Grade</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                <Select
                  value={row.course}
                  onChange={(e) =>
                    handleInputChange(index, "course", e.target.value)
                  }
                  displayEmpty
                  fullWidth
                >
                  <MenuItem value="">-- Select Course --</MenuItem>
                  {Object.keys(courseCreditMap).map((course) => (
                    <MenuItem key={course} value={course}>
                      {course}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <Typography>{row.credits || "-"}</Typography>
              </TableCell>
              <TableCell>
                <Select
                  value={row.grade}
                  onChange={(e) =>
                    handleInputChange(index, "grade", e.target.value)
                  }
                  displayEmpty
                  fullWidth
                >
                  <MenuItem value="">-- Select Grade --</MenuItem>
                  <MenuItem value="A">A</MenuItem>
                  <MenuItem value="B">B</MenuItem>
                  <MenuItem value="C">C</MenuItem>
                  <MenuItem value="D">D</MenuItem>
                  <MenuItem value="F">F</MenuItem>
                </Select>
              </TableCell>
              {index !== 0 ? <TableCell>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveRow(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
              : <TableCell></TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{ marginTop: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          onClick={handleAddRow}
        >
          Add Course
        </Button>
      </Box>
      <Box sx={{ marginTop: 3, textAlign: "center" }}>
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

export default WhatIfGPAAnalysis;