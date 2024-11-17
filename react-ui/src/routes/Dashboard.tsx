import React, { useState } from "react";
import Navbar from "../components/Navbar";
import StudentTable from "../features/students/components/StudentTable";
import InstructorTable from "../features/instructors/components/InstructorTable";
import PersonalInfo from "../components/PersonalInfo";
import StaffTable from "../features/staff/components/StaffTable";
import Analysis from "../components/Analysis";

interface DashboardProps {
  userRole: "student" | "instructor" | "advisor" | "staff" | "admin";
}

const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
  const [view, setView] = useState<
    "dashboard" | "personalInfo" | "whatIfAnalysis"
  >("dashboard");

  const renderContent = () => {
    if (view === "personalInfo") {
      return <PersonalInfo userRole={userRole} />;
    }

    if (view === "dashboard") {
      if (userRole === "student") return <StudentTable />;
      if (userRole === "instructor") return <InstructorTable />;
      if (userRole === "staff") return <StaffTable />;
    }

    if (view === "whatIfAnalysis") {
      return <Analysis />;
    }

    return <div>No data available for this role.</div>;
  };

  return (
    <div className="dashboard">
      <Navbar userRole={userRole} setView={setView} />
      {renderContent()}
    </div>
  );
};

export default Dashboard;
