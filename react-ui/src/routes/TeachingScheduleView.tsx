import React, { useEffect, useState } from "react";
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
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { getInstructorTeachingSchedule } from "../services/courses";

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
  const userId = useSelector((state: RootState) => state.user.userId);

  const [scheduleData, setScheduleData] = useState<Record<string, Schedule[]>>(
    {},
  );
  const [semesters, setSemesters] = useState<
    { value: string; label: string }[]
  >([]);

  const [selectedSemester, setSelectedSemester] =
    useState<keyof typeof scheduleData>("");
  console.log(selectedSemester);
  const [schedule, setSchedule] = useState<Schedule[]>([] as Schedule[]);

  useEffect(() => {
    const fetchTeachingSchedule = async () => {
      if (userId) {
        const teachingSchedule = await getInstructorTeachingSchedule(userId);
        if (teachingSchedule) {
          console.log(teachingSchedule);
          const scheduleData: Record<string, Schedule[]> = {};
          const semesters: { value: string; label: string }[] = [];

          teachingSchedule.forEach((offering: any) => {
            const semester = `${offering.semesters.year} ${offering.semesters.season}`;
            if (!scheduleData[semester]) {
              scheduleData[semester] = [];
              semesters.push({ value: semester, label: semester });
            }

            const schedule: Schedule = {
              course: `${offering.courses.prefix} ${offering.courses.number}`,
              courseName: offering.courses.name,
              days: offering.schedule.days,
              time: offering.schedule.time,
              room: `${offering.rooms.building} ${offering.rooms.room_number}`,
              enrollment: `${offering.course_enrollments.length}/${offering.rooms.capacity}`,
            };
            scheduleData[semester].push(schedule);
          });
          console.log(scheduleData);

          setScheduleData(scheduleData);
          setSemesters(semesters);
          setSelectedSemester(semesters[0].value);
          setSchedule(scheduleData[semesters[0].value]);
        }
      }
    };
    fetchTeachingSchedule();
  }, [userId]);

  console.log(schedule);
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
              <TableCell>
                <strong>Course</strong>
              </TableCell>
              <TableCell>
                <strong>Course Name</strong>
              </TableCell>
              <TableCell>
                <strong>Days</strong>
              </TableCell>
              <TableCell>
                <strong>Time</strong>
              </TableCell>
              <TableCell>
                <strong>Room</strong>
              </TableCell>
              <TableCell>
                <strong>Enrollment</strong>
              </TableCell>
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
