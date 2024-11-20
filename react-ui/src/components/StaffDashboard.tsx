import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

const StaffDashboard: React.FC = () => {
  const useCases = [
    {
      id: "UC01",
      title: "Add Course",
      description:
        "Create new courses and make them available for registration.",
    },
    {
      id: "UC02",
      title: "Assign Instructor to Course",
      description: "Allocate instructors to courses for a semester.",
    },
    {
      id: "UC08",
      title: "Generate Department Report",
      description: "Compile GPA and enrollment data for your department.",
    },
    {
      id: "UC09",
      title: "Modify Student Data",
      description: "Update non-GPA-related student information.",
    },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Staff Dashboard
      </Typography>
      <Grid container spacing={3}>
        {useCases.map((useCase) => (
          <Grid xs={12} sm={6} md={4} key={useCase.id}>
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

export default StaffDashboard;
