import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";

const InstructorDashboard: React.FC = () => {
  const useCases = [
    {
      id: "UC06",
      title: "View Teaching Schedule",
      description: "Access your course assignments and schedules.",
    },
    {
      id: "UC10",
      title: "View Course Enrollments",
      description: "See the list of students enrolled in your courses.",
    },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Instructor Dashboard
      </Typography>
      <Grid container spacing={3}>
        {useCases.map((useCase) => (
          <Grid item xs={12} sm={6} md={4} key={useCase.id}>
            <Card elevation={3}>
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
