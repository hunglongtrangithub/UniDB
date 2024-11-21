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
import { useNavigate } from "react-router-dom";
import { getStudentByUniversityNumber } from "../services/users"; // Assuming these functions exist
import { getAllMajors } from "../services/majors";

const ManageStudentMajor: React.FC = () => {
  const navigate = useNavigate();

  // States for form fields
  const [studentSearch, setStudentSearch] = useState<string>("");
  const [currentMajor, setCurrentMajor] = useState<string>(""); // Example current major
  const [newMajor, setNewMajor] = useState<string>("");
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [majorOptions, setMajorOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchMajors = async () => {
      const majors = await getAllMajors(); // Assuming this function fetches the list of majors
      if (majors) {
        const options = majors.map((major: any) => ({
          value: major.id,
          label: major.name,
        }));
        setMajorOptions(options);
      }
    };

    fetchMajors();
  }, []);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      console.log(studentSearch.length);
      setSuccessMessage(null);
      if (!studentSearch) {
        setErrorMessage(null);
        setStudentInfo(null);
        return;
      }
      if (!studentSearch.match(/^U[0-9]{8}$/)) {
        setErrorMessage(
          "Error: Invalid student ID format. It should be in the form 'U12345678'.",
        );
        setStudentInfo(null);
        return;
      }

      setLoading(true);
      const fetchedStudentInfo =
        await getStudentByUniversityNumber(studentSearch);
      setLoading(false);

      if (!fetchedStudentInfo) {
        setErrorMessage("Error: Student not found.");
        setStudentInfo(null);
        return;
      }

      setStudentInfo(fetchedStudentInfo);
      setCurrentMajor(fetchedStudentInfo.major_name);
      setErrorMessage(null);
    };

    fetchStudentInfo();
  }, [studentSearch]);

  const handleUpdateMajor = () => {
    if (!studentSearch) {
      setErrorMessage("Please enter a student ID.");
    } else if (!newMajor) {
      setErrorMessage("Please select a new major.");
    } else if (studentInfo.major_name === newMajor) {
      setErrorMessage("The new major is the same as the current major.");
    } else {
      console.log("Changing major...");
      setErrorMessage(null);
      setSuccessMessage("Student enrolled successfully!");
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

      {/* Student Search */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="body1" gutterBottom>
          Search Student:
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
              <strong>Current Major:</strong> {currentMajor}
            </Typography>
          </Box>
        )
      )}

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
          <MenuItem value="">
            <em>-- Select New Major --</em>
          </MenuItem>
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
