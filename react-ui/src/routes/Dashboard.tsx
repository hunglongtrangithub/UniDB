import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import LoadingScreen from "../components/LoadingScreen";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";

// Define use cases for each role
const roleUseCases: Record<
  string,
  { id: string; title: string; description: string; route: string }[]
> = {
  student: [
    {
      id: "UC04",
      title: "Perform What-If Analysis",
      description: "Explore GPA scenarios and hypothetical outcomes.",
      route: "/what-if-analysis",
    },
    {
      id: "UC07",
      title: "View Transcript",
      description: "Access your academic transcript with GPAs and grades.",
      route: "/transcript-view",
    },
  ],
  instructor: [
    {
      id: "UC06",
      title: "View Teaching Schedule",
      description: "Access your course assignments and schedules.",
      route: "/teaching-schedule-view",
    },
    {
      id: "UC10",
      title: "View Course Enrollments",
      description: "See the list of students enrolled in your courses.",
      route: "/course-enrollments-view",
    },
  ],
  advisor: [
    {
      id: "UC03",
      title: "Enroll Student",
      description: "Enroll students in courses within your department.",
      route: "/enroll-student",
    },
    {
      id: "UC05",
      title: "View GPA Summary",
      description: "View GPA summaries for students in your department.",
      route: "/gpa-summary-view",
    },
    {
      id: "UC12",
      title: "Manage Student Major",
      description: "Update a student’s major within your department.",
      route: "/manage-student-major",
    },
  ],
  staff: [
    {
      id: "UC01",
      title: "Add Course",
      description: "Create new courses and add them to the system.",
      route: "/add-course",
    },
    {
      id: "UC08",
      title: "Generate Department Report",
      description: "Generate reports summarizing GPA and enrollment data.",
      route: "/generate-department-report",
    },
  ],
};

const Dashboard: React.FC = () => {
  const { userName, userRole } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  if (!userName || !userRole) {
    return (
      <LoadingScreen />
    );
  }

  const useCases = roleUseCases[userRole.toLowerCase()] || [];

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  return (
    <Box>
      <Navbar userName={userName} />
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          {`${userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard`}
        </Typography>
        <Grid container spacing={3}>
          {useCases.map((useCase) => (
            <Grid item xs={12} sm={6} md={4} key={useCase.id}>
              <Card
                elevation={3}
                sx={{ cursor: "pointer" }}
                onClick={() => handleCardClick(useCase.route)}
              >
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {useCase.title}
                  </Typography>
                  <Typography variant="body2">{useCase.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
