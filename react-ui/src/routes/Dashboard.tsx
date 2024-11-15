import React from "react";
import Navbar from "../components/Navbar";
import StudentTable from "../features/students/components/StudentTable";

// User role set to student now for testing
// FIX: User role should be set based on the type of user logged in
const userRole = "student";

// FIX: dashboard should display different content according to the type of user logged in
const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <Navbar userRole={userRole} />
      {userRole == "student" ? <StudentTable /> : null}
    </div>
  );
};

export default Dashboard;
