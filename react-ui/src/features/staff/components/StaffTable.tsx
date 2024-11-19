import React from "react";
import CourseList from "./CourseList";
import InstructorList from "./InstructorList";
import StudentList from "./StudentList";
import DepartmentInfo from "./DepartmentInfo";

const StaffTable: React.FC = () => {
  return (
    <div>
      <CourseList />
      <InstructorList />
      <StudentList />
      <DepartmentInfo />
    </div>
  );
};

export default StaffTable;
