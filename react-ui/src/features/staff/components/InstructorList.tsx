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

interface Instructor {
  id: number;
  name: string;
  email: string;
  department: string;
  courses: string[];
}

const initialInstructors: Instructor[] = [
  {
    id: 1,
    name: "Dr. John Smith",
    email: "john.smith@university.com",
    department: "Computer Science",
    courses: ["CS101 - Data Structures", "CS102 - Algorithms"],
  },
  {
    id: 2,
    name: "Dr. Jane Brown",
    email: "jane.brown@university.com",
    department: "Mathematics",
    courses: ["Math101 - Calculus", "Math102 - Linear Algebra"],
  },
  {
    id: 3,
    name: "Dr. Emily Taylor",
    email: "emily.taylor@university.com",
    department: "Physics",
    courses: ["Physics101 - Mechanics", "Physics102 - Thermodynamics"],
  },
];

const InstructorList: React.FC = () => {
  const [instructors, setInstructors] =
    useState<Instructor[]>(initialInstructors);
  const [editInstructor, setEditInstructor] = useState<Instructor | null>(null);
  const [newInstructor, setNewInstructor] = useState<Omit<Instructor, "id">>({
    name: "",
    email: "",
    department: "",
    courses: [],
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewInstructorDialogOpen, setIsNewInstructorDialogOpen] =
    useState(false);

  const handleEditClick = (instructor: Instructor) => {
    setEditInstructor(instructor);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setInstructors(instructors.filter((instructor) => instructor.id !== id));
  };

  const handleAddInstructorClick = () => {
    setEditInstructor(null);
    setNewInstructor({
      name: "",
      email: "",
      department: "",
      courses: [],
    });
    setIsNewInstructorDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditInstructor(null);
    setNewInstructor({
      name: "",
      email: "",
      department: "",
      courses: [],
    });
    setIsDialogOpen(false);
    setIsNewInstructorDialogOpen(false);
  };

  const handleDialogSave = () => {
    if (editInstructor) {
      setInstructors(
        instructors.map((instructor) =>
          instructor.id === editInstructor.id ? editInstructor : instructor
        )
      );
    } else if (isNewInstructorDialogOpen) {
      const newId =
        Math.max(...instructors.map((instructor) => instructor.id)) + 1;
      setInstructors([
        ...instructors,
        {
          id: newId,
          ...newInstructor,
        },
      ]);
    }
    handleDialogClose();
  };

  const handleInputChange = (
    field: keyof Omit<Instructor, "id">,
    value: string | string[]
  ) => {
    if (editInstructor) {
      setEditInstructor({
        ...editInstructor,
        [field]:
          field === "courses" && typeof value === "string"
            ? value.split(",").map((course) => course.trim())
            : value,
      });
    } else if (isNewInstructorDialogOpen) {
      setNewInstructor({
        ...newInstructor,
        [field]:
          field === "courses" && typeof value === "string"
            ? value.split(",").map((course) => course.trim())
            : value,
      });
    }
  };

  return (
    <div>
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
            Instructor Information
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleAddInstructorClick}
          >
            Add New Instructor
          </Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Instructor Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Courses</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {instructors.map((instructor) => (
              <TableRow key={instructor.id}>
                <TableCell>{instructor.name}</TableCell>
                <TableCell>{instructor.email}</TableCell>
                <TableCell>{instructor.department}</TableCell>
                <TableCell>{instructor.courses.join(", ")}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(instructor)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(instructor.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Instructor Dialog */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Edit Instructor</DialogTitle>
        <DialogContent>
          <TextField
            label="Instructor Name"
            fullWidth
            margin="dense"
            value={editInstructor?.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={editInstructor?.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          <TextField
            label="Department"
            fullWidth
            margin="dense"
            value={editInstructor?.department || ""}
            onChange={(e) => handleInputChange("department", e.target.value)}
          />
          <TextField
            label="Courses (Comma Separated)"
            fullWidth
            margin="dense"
            value={editInstructor?.courses.join(", ") || ""}
            onChange={(e) => handleInputChange("courses", e.target.value)}
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

      {/* Add New Instructor Dialog */}
      <Dialog open={isNewInstructorDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add New Instructor</DialogTitle>
        <DialogContent>
          <TextField
            label="Instructor Name"
            fullWidth
            margin="dense"
            value={newInstructor.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={newInstructor.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          <TextField
            label="Department"
            fullWidth
            margin="dense"
            value={newInstructor.department}
            onChange={(e) => handleInputChange("department", e.target.value)}
          />
          <TextField
            label="Courses (Comma Separated)"
            fullWidth
            margin="dense"
            value={newInstructor.courses.join(", ")}
            onChange={(e) => handleInputChange("courses", e.target.value)}
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
    </div>
  );
};

export default InstructorList;
