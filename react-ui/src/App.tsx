import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import Welcome from "./routes/Welcome";
import Dashboard from "./routes/Dashboard";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import WhatIfGPAAnalysis from "./routes/WhatIfGPAAnalysis";
import TeachingScheduleView from "./routes/TeachingScheduleView";
import CourseEnrollmentView from "./routes/CourseEnrollmentView";
import TranscriptView from "./routes/TranscriptView";
import { supabase } from "./services/client";
import { setUser, clearUser } from "./reducers/userReducer";

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event);
      if (event === "SIGNED_IN") {
        if (session) {
          dispatch(
            setUser({
              userRole: session.user.user_metadata.role,
              userName: `${session.user.user_metadata.first_name} ${session.user.user_metadata.last_name}`,
            }),
          );
          console.log("User signed in.");
        } else {
          console.error("No session found.");
        }
      } else if (event === "SIGNED_OUT") {
        dispatch(clearUser());
        console.log("User signed out.");
      }
    });
  }, [dispatch]); // this effect should only run once because dispatch will never change

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/what-if-analysis" element={<WhatIfGPAAnalysis />} />
        <Route path="/transcript-view" element={<TranscriptView />} />
        <Route path="/teaching-schedule-view" element={<TeachingScheduleView />} />
        <Route path="/course-enrollments-view" element={<CourseEnrollmentView />} />
      </Routes>
    </Router>
  );
};

export default App;
