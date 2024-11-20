import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";

const AdvisorDashboard: React.FC = () => {
  const useCases = [
    {
      id: "UC03",
      title: "Enroll Student",
      description: "Add students to courses within your department.",
    },
    {
      id: "UC05",
      title: "View GPA Summary",
      description: "Review GPA statistics for students in your department.",
    },
    {
      id: "UC12",
      title: "Manage Student Major",
      description: "Update student majors based on academic criteria.",
    },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Advisor Dashboard
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

export default AdvisorDashboard;
