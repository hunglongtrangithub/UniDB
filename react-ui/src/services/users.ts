import { supabase } from "./client";

export const getStudentInfo = async (studentId: string) => {
  // get university number, id, and major id
  // join with users table to get first name, last name
  // join with majors table to get major name
  const { data: student, error: studentError } = await supabase
    .from("students")
    .select(
      `
      id,
      university_number,
      users (
        first_name, last_name
      ),
      majors (
        departments (name),
        name
      )
    `,
    )
    .eq("id", studentId)
    .single();

  if (studentError) {
    console.error("Error fetching student:", studentError.message);
    return null;
  }
  const studentInfo = {
    id: student.id,
    university_number: student.university_number,
    first_name: student.users.first_name,
    last_name: student.users.last_name,
    major_name: student.majors.name,
    department_name: student.majors.departments.name,
  };
  return studentInfo;
};

export const getStudentByUniversityNumber = async (
  universityNumber: string,
) => {
  // Get student id by university number
  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("id")
    .eq("university_number", universityNumber)
    .maybeSingle(); // Use maybeSingle to handle no rows returned

  if (studentError) {
    console.error("Error fetching student:", studentError.message);
    return null;
  }

  if (!student) {
    console.error("No student found with the given university number.");
    return null;
  }

  // Get student info by student id
  const studentInfo = await getStudentInfo(student.id);
  return studentInfo;
};

export const getDepartmentsByAdvisor = async (advisorId: string) => {
  // get all departments for advisor
  const { data: departments, error } = await supabase
    .from("advisor_department")
    .select("departments (name)")
    .eq("advisor_id", advisorId);

  if (error) {
    console.error("Error fetching departments:", error.message);
    return null;
  }
  return departments;
};

export const getStaffDepartment = async (staffId: string) => {
  // get department for staff
  const { data: department, error } = await supabase
    .from("staff")
    .select("departments (*)")
    .eq("id", staffId).single();

  if (error) {
    console.error("Error fetching department:", error.message);
    return null;
  }

  return department;
}