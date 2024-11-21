import React, { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const GPASummaryReport: React.FC = () => {
  const navigate = useNavigate();

  // States for filters and report data
  const [selectedMajor, setSelectedMajor] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [reportData, setReportData] = useState([
    {
      major: "Computer Science",
      highestGPA: 4.0,
      lowestGPA: 2.5,
      averageGPA: 3.2,
    },
    {
      major: "Mathematics",
      highestGPA: 3.9,
      lowestGPA: 2.8,
      averageGPA: 3.4,
    },
  ]);

  // Sample filter options
  const majors = [
    { value: "", label: "-- All Majors --" },
    { value: "cs", label: "Computer Science" },
    { value: "math", label: "Mathematics" },
  ];

  const semesters = [
    { value: "", label: "-- All Semesters --" },
    { value: "fall2023", label: "Fall 2023" },
    { value: "spring2024", label: "Spring 2024" },
  ];

  const handleGenerateReport = () => {
    // Simulate report generation logic
    // You can replace this with an API call or dynamic logic
    alert(
      `Generating report for Major: ${selectedMajor}, Semester: ${selectedSemester}`,
    );
  };

  return (
    <Box
      sx={{
        maxWidth: "800px",
        margin: "50px auto",
        padding: "25px",
        backgroundColor: "#ffffff",
        borderRadius: "5px",
        border: "1px solid #ced4da",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        GPA Summary Report
      </Typography>

      {/* Filter Section */}
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          marginBottom: "20px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Box>
          <Typography variant="body1" gutterBottom>
            Filter by Major:
          </Typography>
          <Select
            fullWidth
            value={selectedMajor}
            onChange={(e) => setSelectedMajor(e.target.value)}
            displayEmpty
          >
            {majors.map((major) => (
              <MenuItem key={major.value} value={major.value}>
                {major.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box>
          <Typography variant="body1" gutterBottom>
            Semester:
          </Typography>
          <Select
            fullWidth
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            displayEmpty
          >
            {semesters.map((semester) => (
              <MenuItem key={semester.value} value={semester.value}>
                {semester.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateReport}
          sx={{ alignSelf: "center", marginTop: "8px" }}
        >
          Generate Report
        </Button>
      </Box>

      {/* Report Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Major</strong>
              </TableCell>
              <TableCell>
                <strong>Highest GPA</strong>
              </TableCell>
              <TableCell>
                <strong>Lowest GPA</strong>
              </TableCell>
              <TableCell>
                <strong>Average GPA</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.major}</TableCell>
                <TableCell>{row.highestGPA}</TableCell>
                <TableCell>{row.lowestGPA}</TableCell>
                <TableCell>{row.averageGPA}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Button Group */}
      <Box sx={{ textAlign: "center", marginTop: "20px" }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </Box>

      {/* Annotations */}
      <Box sx={{ marginTop: 3 }}>
        <Typography variant="caption" color="textSecondary" display="block">
          * This interface allows advisors to view GPA summaries.
        </Typography>
        <Typography variant="caption" color="textSecondary" display="block">
          * Filters are available to select major and semester.
        </Typography>
        <Typography variant="caption" color="textSecondary" display="block">
          * The "Generate Report" button refreshes the report based on selected
          filters.
        </Typography>
        <Typography variant="caption" color="textSecondary" display="block">
          * The report table displays the highest, lowest, and average GPAs.
        </Typography>
        <Typography variant="caption" color="textSecondary" display="block">
          * The "Back to Dashboard" button returns to the Main Dashboard.
        </Typography>
      </Box>
    </Box>
  );
};

export default GPASummaryReport;
