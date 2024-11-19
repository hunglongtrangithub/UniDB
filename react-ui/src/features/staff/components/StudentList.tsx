import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Typography,
} from "@mui/material";

interface Student {
  id: number;
  name: string;
  email: string;
  department: string;
  enrolledCourses: string[];
}

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
      department: "Computer Science",
      enrolledCourses: ["CS101", "CS102"],
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "janesmith@example.com",
      department: "Mathematics",
      enrolledCourses: ["Math101", "Math102"],
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [newStudent, setNewStudent] = useState<Omit<Student, "id">>({
    name: "",
    email: "",
    department: "",
    enrolledCourses: [],
  });
  const [isAddMode, setIsAddMode] = useState(false);

  const handleOpenDialog = (student?: Student) => {
    if (student) {
      setEditStudent(student);
      setIsAddMode(false);
    } else {
      setNewStudent({
        name: "",
        email: "",
        department: "",
        enrolledCourses: [],
      });
      setIsAddMode(true);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditStudent(null);
    setNewStudent({
      name: "",
      email: "",
      department: "",
      enrolledCourses: [],
    });
    setIsAddMode(false);
  };

  const handleInputChange = (
    field: keyof Omit<Student, "id">,
    value: string
  ) => {
    if (isAddMode) {
      setNewStudent((prev) => ({
        ...prev,
        [field]:
          field === "enrolledCourses"
            ? value.split(",").map((course) => course.trim())
            : value,
      }));
    } else if (editStudent) {
      setEditStudent((prev) => ({
        ...prev!,
        [field]:
          field === "enrolledCourses"
            ? value.split(",").map((course) => course.trim())
            : value,
      }));
    }
  };

  const handleDialogSave = () => {
    if (isAddMode) {
      // Add new student with generated ID
      const newId = Math.max(...students.map((s) => s.id), 0) + 1;
      setStudents((prev) => [...prev, { id: newId, ...newStudent }]);
    } else if (editStudent) {
      // Update existing student
      setStudents((prev) =>
        prev.map((student) =>
          student.id === editStudent.id ? editStudent : student
        )
      );
    }
    handleCloseDialog();
  };

  const isFormValid = () => {
    const studentData = isAddMode ? newStudent : editStudent;
    return (
      studentData &&
      studentData.name &&
      studentData.email &&
      studentData.department
    );
  };

  return (
    <div>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Box
          sx={{
            padding: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Student List</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
          >
            Add New Student
          </Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Enrolled Courses</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.department}</TableCell>
                <TableCell>{student.enrolledCourses.join(", ")}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpenDialog(student)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {isAddMode ? "Add New Student" : "Edit Student"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            value={isAddMode ? newStudent.name : editStudent?.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            sx={{ mb: 2, mt: 2 }}
          />
          <TextField
            label="Email"
            fullWidth
            value={isAddMode ? newStudent.email : editStudent?.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Department"
            fullWidth
            value={
              isAddMode ? newStudent.department : editStudent?.department || ""
            }
            onChange={(e) => handleInputChange("department", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Enrolled Courses (Comma separated)"
            fullWidth
            value={
              isAddMode
                ? newStudent.enrolledCourses.join(", ")
                : editStudent?.enrolledCourses.join(", ") || ""
            }
            onChange={(e) =>
              handleInputChange("enrolledCourses", e.target.value)
            }
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleDialogSave}
            color="primary"
            disabled={!isFormValid()}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StudentList;
