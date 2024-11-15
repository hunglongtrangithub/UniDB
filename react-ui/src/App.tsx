import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container, CssBaseline } from "@mui/material";
import Welcome from "./routes/Welcome";
import Login from "./routes/Login";
import Login2 from "./routes/Login2";
import Signup from "./routes/Signup";
import Dashboard from "./routes/Dashboard";
import PersonalInfo from "./routes/PersonalInfo";
import Whatif from "./routes/Whatif";

const App: React.FC = () => {
  return (
    <Router>
      <CssBaseline />
      <Container>
        <Routes>
          <Route path="/" element={<Login2 />} />
          {/* <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/personal_information" element={<PersonalInfo />} />
          <Route path="/what_if_analysis" element={<Whatif />} />
          {/* <Route path="/students" element={<ProtectedRoute component={StudentListPage} />} /> */}
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
