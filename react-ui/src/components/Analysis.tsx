import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Paper,
} from "@mui/material";

const Analysis = () => {
  const [scenario, setScenario] = useState("scenario1"); // Default to Scenario 1
  const [currentGPA, setCurrentGPA] = useState("");
  const [desiredGPA, setDesiredGPA] = useState("");
  const [numCourses, setNumCourses] = useState("");
  const [courseData, setCourseData] = useState([{ credits: "", grade: "" }]);
  const [results, setResults] = useState("");

  // Grades mapped to points (e.g., A = 4.0, B = 3.0, etc.)
  const gradePoints = { A: 4.0, B: 3.0, C: 2.0, D: 1.0, F: 0.0 };

  // Handle scenario change
  const handleScenarioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScenario(event.target.value);
    setResults("");
  };

  // Add more courses dynamically
  const addCourse = () => {
    setCourseData([...courseData, { credits: "", grade: "" }]);
  };

  // Update course data
  const handleCourseChange = (index: number, field: string, value: string) => {
    const updatedCourses = [...courseData];
    updatedCourses[index][field] = value;
    setCourseData(updatedCourses);
  };

  // Perform analysis
  const performAnalysis = () => {
    if (scenario === "scenario1") {
      let totalPoints = 0;
      let totalCredits = 0;

      courseData.forEach((course) => {
        const gradePoint = gradePoints[course.grade] || 0;
        const credits = parseFloat(course.credits) || 0;
        totalPoints += gradePoint * credits;
        totalCredits += credits;
      });

      const currentGPANum = parseFloat(currentGPA) || 0;
      const newGPA =
        totalCredits > 0
          ? (currentGPANum * 120 + totalPoints) / (120 + totalCredits)
          : currentGPANum;

      setResults(
        `If you take these courses, your new GPA would be ${newGPA.toFixed(2)}.`
      );
    } else if (scenario === "scenario2") {
      const desired = parseFloat(desiredGPA) || 0;
      const current = parseFloat(currentGPA) || 0;
      const requiredCredits = Math.ceil((desired * 120 - current * 120) / 4);

      setResults(
        `To achieve a GPA of ${desired}, you would need to take approximately ${requiredCredits} more credits with all A grades.`
      );
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        What-If Analysis
      </Typography>

      {/* Scenario Selection */}
      <TextField
        select
        label="Select Scenario"
        value={scenario}
        onChange={handleScenarioChange}
        sx={{ mb: 4, width: "300px" }}
      >
        <MenuItem value="scenario1">
          Scenario 1: Impact of N more courses on GPA
        </MenuItem>
        <MenuItem value="scenario2">
          Scenario 2: Courses required to reach desired GPA
        </MenuItem>
      </TextField>

      {/* Scenario Inputs */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Current GPA"
            value={currentGPA}
            onChange={(e) => setCurrentGPA(e.target.value)}
            fullWidth
            type="number"
            inputProps={{ step: "0.01", min: "0", max: "4.0" }}
          />
        </Grid>

        {scenario === "scenario1" && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Number of Courses"
                value={numCourses}
                onChange={(e) => setNumCourses(e.target.value)}
                fullWidth
                type="number"
              />
            </Grid>
            {courseData.map((course, index) => (
              <Grid container spacing={2} key={index} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <TextField
                    label="Credits"
                    value={course.credits}
                    onChange={(e) =>
                      handleCourseChange(index, "credits", e.target.value)
                    }
                    fullWidth
                    type="number"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    select
                    label="Grade"
                    value={course.grade}
                    onChange={(e) =>
                      handleCourseChange(index, "grade", e.target.value)
                    }
                    fullWidth
                  >
                    {Object.keys(gradePoints).map((grade) => (
                      <MenuItem key={grade} value={grade}>
                        {grade}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            ))}
            <Button onClick={addCourse} variant="contained" sx={{ mt: 2 }}>
              Add Another Course
            </Button>
          </>
        )}

        {scenario === "scenario2" && (
          <Grid item xs={12} sm={6}>
            <TextField
              label="Desired GPA"
              value={desiredGPA}
              onChange={(e) => setDesiredGPA(e.target.value)}
              fullWidth
              type="number"
              inputProps={{ step: "0.01", min: "0", max: "4.0" }}
            />
          </Grid>
        )}
      </Grid>

      {/* Perform Analysis Button */}
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" color="primary" onClick={performAnalysis}>
          Perform Analysis
        </Button>
      </Box>

      {/* Results */}
      {results && (
        <Paper elevation={3} sx={{ mt: 4, p: 2 }}>
          <Typography variant="h6">Results:</Typography>
          <Typography>{results}</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Analysis;
