import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container, CssBaseline } from "@mui/material";
import Welcome from "./routes/Welcome";
import Login from "./routes/Login";
import Login2 from "./routes/Login2";
import Signup from "./routes/Signup";
import Dashboard from "./routes/Dashboard";

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<
    "student" | "instructor" | "advisor" | "staff" | "admin"
  >("staff");

  return (
    <Router>
      <CssBaseline />
      <Container>
        <Routes>
          <Route path="/" element={<Login2 />} />
          {/* <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> */}
          <Route
            path="/dashboard"
            element={<Dashboard userRole={userRole} />}
          />
          {/* <Route path="/students" element={<ProtectedRoute component={StudentListPage} />} /> */}
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
