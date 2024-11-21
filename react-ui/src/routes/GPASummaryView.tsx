import React, { useState, useEffect } from "react";
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
import {
  getAllMajors,
  getAllSemesters,
  getGPAByMajor,
} from "../services/majors";
import { getDepartmentsByAdvisor } from "../services/users";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const GPASummaryReport: React.FC = () => {
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.user.userId);
  const [advisorDepartments, setAdvisorDepartments] = useState<string[]>([]);

  const [selectedMajor, setSelectedMajor] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [reportData, setReportData] = useState<
    {
      major: string;
      highestGPA: number | null;
      lowestGPA: number | null;
      averageGPA: number | null;
    }[]
  >([]);

  const [majors, setMajors] = useState<{ value: string; label: string }[]>([]);
  const [semesters, setSemesters] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    const fetchAdvisorDepartments = async () => {
      if (!userId) return;
      const departments = await getDepartmentsByAdvisor(userId);
      if (departments) {
        const departmentNames = departments.map(
          (dept: any) => dept.departments.name,
        );
        console.log("Advisor departments:", departmentNames);
        setAdvisorDepartments(departmentNames);
      }
    };

    fetchAdvisorDepartments();
  }, [userId]);

  useEffect(() => {
    const fetchMajorsAndGPA = async () => {
      const fetchedMajors = await getAllMajors();
      if (!fetchedMajors) return;
      console.log("Fetched majors:", fetchedMajors);
      console.log("Advisor departments:", advisorDepartments);
      const filteredMajors = fetchedMajors.filter((major: any) =>
        advisorDepartments.includes(major.departments.name),
      );
      if (filteredMajors) {
        setMajors([
          { value: "", label: "-- All Majors --" },
          ...filteredMajors.map((major: any) => ({
            value: major.id,
            label: major.name,
          })),
        ]);

        const gpaData = await Promise.all(
          filteredMajors.map(async (major: any) => {
            if (selectedMajor && selectedMajor !== major.id) return null;
            const gpaStats = await getGPAByMajor(major.id);
            return {
              major: major.name,
              highestGPA: gpaStats?.highestGPA || null,
              lowestGPA: gpaStats?.lowestGPA || null,
              averageGPA: gpaStats?.averageGPA || null,
            };
          }),
        );

        setReportData(gpaData.filter((data) => data !== null));
      }
    };

    const fetchSemesters = async () => {
      const fetchedSemesters = await getAllSemesters();
      if (fetchedSemesters) {
        setSemesters([
          { value: "", label: "-- All Semesters --" },
          ...fetchedSemesters.map((semester: any) => ({
            value: `${semester.year}${semester.season}`,
            label: `${semester.season} ${semester.year}`,
          })),
        ]);
      }
    };

    fetchMajorsAndGPA();
    fetchSemesters();
  }, [selectedMajor, advisorDepartments]);

  const handleGenerateReport = () => {
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
