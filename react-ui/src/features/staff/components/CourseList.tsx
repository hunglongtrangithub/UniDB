import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";

interface Course {
  id: number;
  name: string;
  code: string;
  instructor: string;
  department: string;
}

const initialCourses: Course[] = [
  {
    id: 1,
    name: "Data Structures",
    code: "CS101",
    instructor: "Dr. Smith",
    department: "Computer Science",
  },
  {
    id: 2,
    name: "Algorithms",
    code: "CS102",
    instructor: "Dr. Brown",
    department: "Computer Science",
  },
  {
    id: 3,
    name: "Database Systems",
    code: "CS103",
    instructor: "Dr. Taylor",
    department: "Computer Science",
  },
];

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [newCourse, setNewCourse] = useState<Omit<Course, "id">>({
    name: "",
    code: "",
    instructor: "",
    department: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewCourseDialogOpen, setIsNewCourseDialogOpen] = useState(false);

  const handleEditClick = (course: Course) => {
    setEditCourse(course);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  const handleAddCourseClick = () => {
    setEditCourse(null);
    setNewCourse({
      name: "",
      code: "",
      instructor: "",
      department: "",
    });
    setIsNewCourseDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditCourse(null);
    setIsDialogOpen(false);
    setIsNewCourseDialogOpen(false);
  };

  const handleDialogSave = () => {
    if (editCourse) {
      setCourses(
        courses.map((course) =>
          course.id === editCourse.id ? editCourse : course
        )
      );
    } else if (isNewCourseDialogOpen) {
      // Generate new ID (in production, this should come from the backend)
      const newId = Math.max(...courses.map((course) => course.id)) + 1;

      // Add new course to the courses array
      setCourses([
        ...courses,
        {
          id: newId,
          ...newCourse,
        },
      ]);
    }
    handleDialogClose();
  };

  const handleInputChange = (
    field: keyof Omit<Course, "id">,
    value: string
  ) => {
    if (editCourse) {
      setEditCourse({ ...editCourse, [field]: value });
    } else if (isNewCourseDialogOpen) {
      setNewCourse({ ...newCourse, [field]: value });
    }
  };

  return (
    <TableContainer component={Paper} sx={{ margin: "auto", mt: 4 }}>
      <Box
        sx={{
          padding: 1,
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h6" align="center">
          Course Information
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddCourseClick}
        >
          Add New Course
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Course Name</TableCell>
            <TableCell>Course Code</TableCell>
            <TableCell>Instructor</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell>{course.name}</TableCell>
              <TableCell>{course.code}</TableCell>
              <TableCell>{course.instructor}</TableCell>
              <TableCell>{course.department}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEditClick(course)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDeleteClick(course.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Edit Course</DialogTitle>
        <DialogContent>
          <TextField
            label="Course Name"
            fullWidth
            margin="dense"
            value={editCourse?.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
          <TextField
            label="Course Code"
            fullWidth
            margin="dense"
            value={editCourse?.code || ""}
            onChange={(e) => handleInputChange("code", e.target.value)}
          />
          <TextField
            label="Instructor"
            fullWidth
            margin="dense"
            value={editCourse?.instructor || ""}
            onChange={(e) => handleInputChange("instructor", e.target.value)}
          />
          <TextField
            label="Department"
            fullWidth
            margin="dense"
            value={editCourse?.department || ""}
            onChange={(e) => handleInputChange("department", e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={handleDialogSave}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* Add New Course Dialog */}
      <Dialog open={isNewCourseDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent>
          <TextField
            label="Course Name"
            fullWidth
            margin="dense"
            value={newCourse.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
          <TextField
            label="Course Code"
            fullWidth
            margin="dense"
            value={newCourse.code}
            onChange={(e) => handleInputChange("code", e.target.value)}
          />
          <TextField
            label="Instructor"
            fullWidth
            margin="dense"
            value={newCourse.instructor}
            onChange={(e) => handleInputChange("instructor", e.target.value)}
          />
          <TextField
            label="Department"
            fullWidth
            margin="dense"
            value={newCourse.department}
            onChange={(e) => handleInputChange("department", e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={handleDialogSave}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default CourseList;
