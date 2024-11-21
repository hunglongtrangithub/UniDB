import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ManageStudentMajor: React.FC = () => {
  const navigate = useNavigate();

  // States for form fields
  const [studentSearch, setStudentSearch] = useState<string>("");
  const [currentMajor, setCurrentMajor] = useState<string>(""); // Example current major
  const [newMajor, setNewMajor] = useState<string>("");

  // Sample new major options
  const majorOptions = [
    { value: "", label: "-- Select New Major --" },
    { value: "cs", label: "Computer Science" },
    { value: "math", label: "Mathematics" },
    { value: "eng", label: "English" },
  ];

  const handleUpdateMajor = () => {
    if (!studentSearch) {
      alert("Please search for a student.");
    } else if (!newMajor) {
      alert("Please select a new major.");
    } else {
      // Simulate updating major logic
      alert(`Updated ${studentSearch}'s major to ${newMajor}`);
      // Add API call or logic here to update the major
    }
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
        Manage Student Major
      </Typography>

      {/* Student Search */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="body1" gutterBottom>
          Search Student:
        </Typography>
        <TextField
          fullWidth
          placeholder="Enter student ID or name"
          value={studentSearch}
          onChange={(e) => setStudentSearch(e.target.value)}
        />
      </Box>

      {/* Current Major */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="body1" gutterBottom>
          Current Major:
        </Typography>
        <TextField
          fullWidth
          value={currentMajor}
          InputProps={{
            readOnly: true,
          }}
        />
      </Box>

      {/* New Major Selection */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="body1" gutterBottom>
          Select New Major:
        </Typography>
        <Select
          fullWidth
          value={newMajor}
          onChange={(e) => setNewMajor(e.target.value)}
          displayEmpty
        >
          {majorOptions.map((major) => (
            <MenuItem key={major.value} value={major.value}>
              {major.label}
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
          onClick={handleUpdateMajor}
        >
          Update Major
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
          * This form allows advisors to manage and update a student's major.
        </Typography>
        <Typography variant="caption" color="textSecondary" display="block">
          * Advisors search for the student and view the current major.
        </Typography>
        <Typography variant="caption" color="textSecondary" display="block">
          * A new major is selected from the dropdown list.
        </Typography>
        <Typography variant="caption" color="textSecondary" display="block">
          * The "Update Major" button submits the change request.
        </Typography>
        <Typography variant="caption" color="textSecondary" display="block">
          * The "Cancel" button returns to the Main Dashboard.
        </Typography>
      </Box>
    </Box>
  );
};

export default ManageStudentMajor;
