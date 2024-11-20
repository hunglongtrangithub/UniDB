import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

const StudentDashboard: React.FC = () => {
  const useCases = [
    {
      id: "UC04",
      title: "Perform What-If Analysis",
      description: "Explore GPA scenarios and hypothetical outcomes.",
    },
    {
      id: "UC07",
      title: "View Transcript",
      description: "Access your academic transcript with GPAs and grades.",
    },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Student Dashboard
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

export default StudentDashboard;
