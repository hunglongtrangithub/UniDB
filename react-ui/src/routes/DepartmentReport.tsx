import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import { getStaffDepartment } from "../services/users";
import { useSelector } from "react-redux";
import {
  getDepartmentCourses,
  getDepartmentStaff,
  getDepartmentInstructors,
  getDepartmentStudents,
  getDepartmentAdvisors,
  getDepartmentMajors,
} from "../services/departments";
import { RootState } from "../store";

interface Department {
  id: string;
  name: string;
  building: string;
  office: string;
}

interface Student {
  id: string;
  university_number: string;
  first_name: string;
  last_name: string;
  major_id: string;
}

interface Instructor {
  id: string;
  first_name: string;
  last_name: string;
}

interface Advisor {
  id: string;
  first_name: string;
  last_name: string;
}

interface Major {
  id: string;
  name: string;
  is_unique: boolean;
}

interface Course {
  id: string;
  prefix: string;
  number: string;
  name: string;
  credits: number;
}

interface StaffMember {
  id: string;
  first_name: string;
  last_name: string;
}

const DepartmentReport: React.FC = () => {
  const navigate = useNavigate();
  const staffId = useSelector((state: RootState) => state.user.userId);
  const [department, setDepartment] = useState<Department | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        if (!staffId) {
          console.error("No staff ID found.");
          setLoading(false);
          return;
        }
        // Fetch the department of the staff member
        const departmentData = await getStaffDepartment(staffId);
        if (!departmentData) {
          console.error("No department found for this staff member.");
          setLoading(false);
          return;
        }

        setDepartment(departmentData);

        const departmentId = departmentData.id;
        console.log("Department ID:", departmentId);
        // Fetch department-related data in parallel
        const [
          coursesData,
          staffData,
          studentsData,
          instructorsData,
          advisorsData,
          majorsData,
        ] = await Promise.all([
          getDepartmentCourses(departmentId),
          getDepartmentStaff(departmentId),
          getDepartmentStudents(departmentId),
          getDepartmentInstructors(departmentId),
          getDepartmentAdvisors(departmentId),
          getDepartmentMajors(departmentId),
        ]);

        setCourses(coursesData || []);
        setStaff(staffData || null);
        setStudents(studentsData || []);
        setInstructors(instructorsData || []);
        setAdvisors(advisorsData || []);
        setMajors(majorsData || []);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching department data:", error);
        setLoading(false);
      }
    };

    fetchDepartmentData();
  }, [staffId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!department) {
    return <Typography>No department data available.</Typography>;
  }

  return (
    <Box
      sx={{
        maxWidth: "1000px",
        margin: "50px auto",
        padding: "25px",
        backgroundColor: "#ffffff",
        borderRadius: "5px",
        border: "1px solid #ced4da",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Department Report: {department.name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Building:</strong> {department.building}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Office:</strong> {department.office}
      </Typography>

      {/* Courses Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Courses</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {courses.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Course Code</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Credits</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        {course.prefix} {course.number}
                      </TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>{course.credits}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No courses available.</Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Staff Member Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Staff Member</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {staff ? (
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {staff.first_name} {staff.last_name}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No staff member available.</Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Students Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Students</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {students.length > 0 ? (
            students.map((student) => (
              <Box key={student.id} sx={{ marginBottom: 2 }}>
                <Typography variant="subtitle1">
                  {student.first_name} {student.last_name} - University Number:{" "}
                  {student.university_number}
                </Typography>
                {/* Course Enrollments
                {student.course_enrollments &&
                  student.course_enrollments.length > 0 && (
                    <TableContainer component={Paper} sx={{ marginTop: 1 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <strong>Course</strong>
                            </TableCell>
                            <TableCell>
                              <strong>Semester</strong>
                            </TableCell>
                            <TableCell>
                              <strong>Credits</strong>
                            </TableCell>
                            <TableCell>
                              <strong>Grade</strong>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {student.course_enrollments.map((enrollment, idx) => (
                            <TableRow key={idx}>
                              <TableCell>
                                {enrollment.course_offerings.courses.prefix}{" "}
                                {enrollment.course_offerings.courses.number} -{" "}
                                {enrollment.course_offerings.courses.name}
                              </TableCell>
                              <TableCell>
                                {enrollment.course_offerings.semesters.season}{" "}
                                {enrollment.course_offerings.semesters.year}
                              </TableCell>
                              <TableCell>
                                {enrollment.course_offerings.courses.credits}
                              </TableCell>
                              <TableCell>{enrollment.grade || "N/A"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )} */}
              </Box>
            ))
          ) : (
            <Typography>No students available.</Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Instructors Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Instructors</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {instructors.length > 0 ? (
            instructors.map((instructor) => (
              <Box key={instructor.id} sx={{ marginBottom: 2 }}>
                <Typography variant="subtitle1">
                  {instructor.first_name} {instructor.last_name}
                </Typography>
                Teaching Schedule
                {/* {instructor.teaching_schedule &&
                  instructor.teaching_schedule.length > 0 && (
                    <Box sx={{ marginTop: 1 }}>
                      <Typography variant="subtitle2">
                        Teaching Schedule:
                      </Typography>
                      <TableContainer component={Paper} sx={{ marginTop: 1 }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <strong>Course</strong>
                              </TableCell>
                              <TableCell>
                                <strong>Semester</strong>
                              </TableCell>
                              <TableCell>
                                <strong>Schedule</strong>
                              </TableCell>
                              <TableCell>
                                <strong>Room</strong>
                              </TableCell>
                              <TableCell>
                                <strong>Enrolled Students</strong>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {instructor.teaching_schedule.map(
                              (scheduleItem, idx) => (
                                <TableRow key={idx}>
                                  <TableCell>
                                    {scheduleItem.courses.prefix}{" "}
                                    {scheduleItem.courses.number} -{" "}
                                    {scheduleItem.courses.name}
                                  </TableCell>
                                  <TableCell>
                                    {scheduleItem.semesters.season}{" "}
                                    {scheduleItem.semesters.year}
                                  </TableCell>
                                  <TableCell>{scheduleItem.schedule}</TableCell>
                                  <TableCell>
                                    {scheduleItem.rooms.building}{" "}
                                    {scheduleItem.rooms.room_number} (Capacity:{" "}
                                    {scheduleItem.rooms.capacity})
                                  </TableCell>
                                  <TableCell>
                                    {scheduleItem.course_enrollments.length}
                                  </TableCell>
                                </TableRow>
                              ),
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )} */}
                {/* Course Enrollments */}
                {/* {instructor.course_enrollments &&
                  instructor.course_enrollments.length > 0 && (
                    <Box sx={{ marginTop: 2 }}>
                      <Typography variant="subtitle2">
                        Course Enrollments:
                      </Typography>
                      {instructor.course_enrollments.map(
                        (courseEnrollment, idx) => (
                          <Box key={idx} sx={{ marginTop: 1 }}>
                            <Typography variant="body2">
                              {courseEnrollment.courses.prefix}{" "}
                              {courseEnrollment.courses.number} -{" "}
                              {courseEnrollment.courses.name} -{" "}
                              {courseEnrollment.semesters.season}{" "}
                              {courseEnrollment.semesters.year}
                            </Typography>
                            <TableContainer
                              component={Paper}
                              sx={{ marginTop: 1 }}
                            >
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>
                                      <strong>Student</strong>
                                    </TableCell>
                                    <TableCell>
                                      <strong>University Number</strong>
                                    </TableCell>
                                    <TableCell>
                                      <strong>Grade</strong>
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {courseEnrollment.course_enrollments.map(
                                    (enrollment, idx2) => (
                                      <TableRow key={idx2}>
                                        <TableCell>
                                          {enrollment.students.users.first_name}{" "}
                                          {enrollment.students.users.last_name}
                                        </TableCell>
                                        <TableCell>
                                          {
                                            enrollment.students
                                              .university_number
                                          }
                                        </TableCell>
                                        <TableCell>
                                          {enrollment.grade || "N/A"}
                                        </TableCell>
                                      </TableRow>
                                    ),
                                  )}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Box>
                        ),
                      )}
                    </Box>
                  )} */}
              </Box>
            ))
          ) : (
            <Typography>No instructors available.</Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Advisors Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Advisors</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {advisors.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  {advisors.map((advisor, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {advisor.first_name} {advisor.last_name}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No advisors available.</Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Majors Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Majors</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {majors.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  {majors.map((major) => (
                    <TableRow key={major.id}>
                      <TableCell>
                        {major.name} {major.is_unique ? "(Unique)" : ""}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No majors available.</Typography>
          )}
        </AccordionDetails>
      </Accordion>

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
          * This report provides detailed information about the department.
        </Typography>
        <Typography variant="caption" color="textSecondary" display="block">
          * Use the sections above to explore courses, staff, students,
          instructors, advisors, and majors.
        </Typography>
        <Typography variant="caption" color="textSecondary" display="block">
          * Click on the section headers to expand or collapse each section.
        </Typography>
        <Typography variant="caption" color="textSecondary" display="block">
          * The "Back to Dashboard" button returns to the Main Dashboard.
        </Typography>
      </Box>
    </Box>
  );
};

export default DepartmentReport;
