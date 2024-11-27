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
  name: string;
  building: string;
  office: string;
}

interface Student {
  university_number: string;
  first_name: string;
  last_name: string;
  major_name: string;
}

interface Instructor {
  first_name: string;
  last_name: string;
}

interface Advisor {
  first_name: string;
  last_name: string;
}

interface Major {
  name: string;
  is_unique: boolean;
}

interface Course {
  prefix: string;
  number: string;
  name: string;
  credits: number;
}

interface StaffMember {
  first_name: string;
  last_name: string;
}

const DepartmentReport: React.FC = () => {
  const navigate = useNavigate();
  const staffId = useSelector((state: RootState) => state.user.userId);
  const [department, setDepartment] = useState<Department | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
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
        setStaff(staffData || []);
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
                  {courses.map((course, idx) => (
                    <TableRow key={idx}>
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
          {staff.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>First Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Last Name</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {staff.map((staffMember, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{staffMember.first_name}</TableCell>
                      <TableCell>{staffMember.last_name}</TableCell>
                    </TableRow>
                  ))}
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
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>First Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Last Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>University Number</strong>
                    </TableCell>
                    <TableCell>
                      <strong> Major</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{student.first_name}</TableCell>
                      <TableCell>{student.last_name}</TableCell>
                      <TableCell>{student.university_number}</TableCell>
                      <TableCell>{student.major_name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>First Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Last Name</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {instructors.map((instructor, index) => (
                    <TableRow key={index}>
                      <TableCell>{instructor.first_name}</TableCell>
                      <TableCell>{instructor.last_name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>First Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Last Name</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {advisors.map((advisor, index) => (
                    <TableRow key={index}>
                      <TableCell>{advisor.first_name}</TableCell>
                      <TableCell>{advisor.last_name}</TableCell>
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
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Is Unique</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {majors.map((major, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{major.name}</TableCell>
                      <TableCell>{major.is_unique ? "Yes" : "No"}</TableCell>
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
