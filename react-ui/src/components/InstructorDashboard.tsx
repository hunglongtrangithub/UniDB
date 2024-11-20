import React from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";

const InstructorDashboard: React.FC = () => {
  const navigate = useNavigate();

  const useCases = [
    {
      id: "UC06",
      title: "View Teaching Schedule",
      description: "Access your course assignments and schedules.",
      route: "/teaching-schedule-view", // Route for the schedule page
    },
    {
      id: "UC10",
      title: "View Course Enrollments",
      description: "See the list of students enrolled in your courses.",
      route: "/course-enrollments-view", // Route for the enrollments page
    },
  ];

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Instructor Dashboard
      </Typography>
      <Grid container spacing={3}>
        {useCases.map((useCase) => (
          <Grid item xs={12} sm={6} md={4} key={useCase.id}>
            <Card
              elevation={3}
              sx={{ cursor: "pointer" }}
              onClick={() => handleCardClick(useCase.route)} // Navigate on click
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
  );
};

export default InstructorDashboard;
