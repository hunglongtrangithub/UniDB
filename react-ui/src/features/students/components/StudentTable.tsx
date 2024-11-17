import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// Dummy data for displaying course information for student
const courses = [
  {
    course_name: "Computer Architecture",
    date: "MW",
    time: "3:30 pm - 4:45 pm",
    instructor: "Professor X",
  },
  {
    course_name: "Database Design",
    date: "MW",
    time: "5:00 pm - 6:15 pm",
    instructor: "Professor Y",
  },
  {
    course_name: "Analysis of Algorithms",
    date: "TH",
    time: "3:30 pm - 4:45 pm",
    instructor: "Professor A",
  },
  {
    course_name: "Software Engineering",
    date: "MW",
    time: "8:00 am - 9:15 am",
    instructor: "Professor B",
  },
];

const StudentTable = () => {
  return (
    <TableContainer component={Paper} sx={{ margin: "auto", mt: 4 }}>
      <Table sx={{ minWidth: 650 }} aria-label="course table">
        <TableHead>
          <TableRow>
            <TableCell>Course Name</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Time</TableCell>
            <TableCell align="right">Instructor</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map((course, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {course.course_name}
              </TableCell>
              <TableCell align="right">{course.date}</TableCell>
              <TableCell align="right">{course.time}</TableCell>
              <TableCell align="right">{course.instructor}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudentTable;
