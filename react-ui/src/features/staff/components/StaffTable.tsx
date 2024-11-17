import React from "react";
import CourseList from "./CourseList";
import InstructorList from "./InstructorList";
import StudentList from "../../staff/components/StudentList";

const StaffTable: React.FC = () => {
  return (
    <div>
      <CourseList />
      <InstructorList />
      <StudentList />
      <h2>Department Information</h2>
    </div>
  );
};

export default StaffTable;
