import React, { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Define the type for schedule data
interface Schedule {
  course: string;
  courseName: string;
  days: string;
  time: string;
  room: string;
  enrollment: string;
}

const TeachingScheduleView: React.FC = () => {
  const navigate = useNavigate();

  // Sample data for semesters and schedule
  const semesters = [
    { value: "fall2023", label: "Fall 2023" },
    { value: "spring2024", label: "Spring 2024" },
  ];

  const scheduleData: Record<string, Schedule[]> = {
    fall2023: [
      {
        course: "CS101",
        courseName: "Introduction to Computer Science",
        days: "Mon, Wed, Fri",
        time: "9:00 AM - 10:15 AM",
        room: "Room 101",
        enrollment: "30/40",
      },
      {
        course: "CS202",
        courseName: "Data Structures",
        days: "Tue, Thu",
        time: "11:00 AM - 12:15 PM",
        room: "Room 202",
        enrollment: "25/35",
      },
    ],
    spring2024: [
      {
        course: "CS303",
        courseName: "Algorithms",
        days: "Mon, Wed",
        time: "10:30 AM - 11:45 AM",
        room: "Room 303",
        enrollment: "20/30",
      },
      {
        course: "CS404",
        courseName: "Operating Systems",
        days: "Tue, Thu",
        time: "1:00 PM - 2:15 PM",
        room: "Room 404",
        enrollment: "18/25",
      },
    ],
  };

  const [selectedSemester, setSelectedSemester] = useState<keyof typeof scheduleData>("fall2023");
  const [schedule, setSchedule] = useState<Schedule[]>(scheduleData[selectedSemester]);

  const handleSemesterChange = (event: SelectChangeEvent) => {
    const semester = event.target.value as keyof typeof scheduleData; // Explicitly cast the key
    setSelectedSemester(semester);
    setSchedule(scheduleData[semester]); // Access using typed key
  };

  return (
    <Box
      sx={{
        padding: 4,
        maxWidth: "800px",
        margin: "50px auto",
        backgroundColor: "#ffffff",
        borderRadius: "5px",
        border: "1px solid #ced4da",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Teaching Schedule
      </Typography>

      {/* Semester Selection */}
      <Box sx={{ marginBottom: 3, textAlign: "center" }}>
        <Typography variant="body1" gutterBottom>
          Select Semester:
        </Typography>
        <Select
          value={selectedSemester}
          onChange={handleSemesterChange}
          displayEmpty
          sx={{ width: "200px" }}
        >
          {semesters.map((semester) => (
            <MenuItem key={semester.value} value={semester.value}>
              {semester.label}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Schedule Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Course</strong></TableCell>
              <TableCell><strong>Course Name</strong></TableCell>
              <TableCell><strong>Days</strong></TableCell>
              <TableCell><strong>Time</strong></TableCell>
              <TableCell><strong>Room</strong></TableCell>
              <TableCell><strong>Enrollment</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedule.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.course}</TableCell>
                <TableCell>{row.courseName}</TableCell>
                <TableCell>{row.days}</TableCell>
                <TableCell>{row.time}</TableCell>
                <TableCell>{row.room}</TableCell>
                <TableCell>{row.enrollment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Button Group */}
      <Box sx={{ marginTop: 4, textAlign: "center" }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default TeachingScheduleView;
