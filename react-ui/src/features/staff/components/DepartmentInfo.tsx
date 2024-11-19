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

interface Department {
  id: number;
  name: string;
  building: string;
  office: string;
}

const DepartmentList: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 1,
      name: "Computer Science",
      building: "Engineering Building",
      office: "Room 305",
    },
    {
      id: 2,
      name: "Mathematics",
      building: "Science Building",
      office: "Room 202",
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editDepartment, setEditDepartment] = useState<Department | null>(null);
  const [newDepartment, setNewDepartment] = useState<Omit<Department, "id">>({
    name: "",
    building: "",
    office: "",
  });
  const [isAddMode, setIsAddMode] = useState(false);

  const handleOpenDialog = (department?: Department) => {
    if (department) {
      setEditDepartment(department);
      setIsAddMode(false);
    } else {
      setNewDepartment({
        name: "",
        building: "",
        office: "",
      });
      setIsAddMode(true);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditDepartment(null);
    setNewDepartment({
      name: "",
      building: "",
      office: "",
    });
    setIsAddMode(false);
  };

  const handleInputChange = (
    field: keyof Omit<Department, "id">,
    value: string
  ) => {
    if (isAddMode) {
      setNewDepartment((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else if (editDepartment) {
      setEditDepartment((prev) => ({
        ...prev!,
        [field]: value,
      }));
    }
  };

  const handleDialogSave = () => {
    if (isAddMode) {
      // Add new department with generated ID
      const newId = Math.max(...departments.map((d) => d.id), 0) + 1;
      setDepartments((prev) => [...prev, { id: newId, ...newDepartment }]);
    } else if (editDepartment) {
      // Update existing department
      setDepartments((prev) =>
        prev.map((department) =>
          department.id === editDepartment.id ? editDepartment : department
        )
      );
    }
    handleCloseDialog();
  };

  const isFormValid = () => {
    const departmentData = isAddMode ? newDepartment : editDepartment;
    return (
      departmentData &&
      departmentData.name &&
      departmentData.building &&
      departmentData.office
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
          <Typography variant="h6">Department List</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
          >
            Add New Department
          </Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Building</TableCell>
              <TableCell>Office</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.map((department) => (
              <TableRow key={department.id}>
                <TableCell>{department.id}</TableCell>
                <TableCell>{department.name}</TableCell>
                <TableCell>{department.building}</TableCell>
                <TableCell>{department.office}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpenDialog(department)}
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
          {isAddMode ? "Add New Department" : "Edit Department"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Department Name"
            fullWidth
            value={isAddMode ? newDepartment.name : editDepartment?.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            sx={{ mb: 2, mt: 2 }}
          />
          <TextField
            label="Building"
            fullWidth
            value={
              isAddMode
                ? newDepartment.building
                : editDepartment?.building || ""
            }
            onChange={(e) => handleInputChange("building", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Office"
            fullWidth
            value={
              isAddMode ? newDepartment.office : editDepartment?.office || ""
            }
            onChange={(e) => handleInputChange("office", e.target.value)}
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

export default DepartmentList;
